import { NextResponse } from "next/server";
import { z } from "zod";

import { getAiConfig } from "@/config/ai";
import { permissions } from "@/config/permissions";
import { blogContentDraftPrompt } from "@/features/ai/prompts";
import { checkRateLimit } from "@/features/ai/services/token-manager";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/authorization";

const streamRequestSchema = z.object({
  title: z.string().trim().min(3),
  excerpt: z.string().trim().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || !hasPermission(session.user.permissions ?? [], permissions.ai.generate)) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const config = getAiConfig();
  if (!config.enabled || !config.openai.apiKey) {
    return NextResponse.json({ error: "AI yapılandırılmamış" }, { status: 503 });
  }

  try {
    const body = streamRequestSchema.parse(await request.json());
    checkRateLimit(userId);

    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.openai.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.openai.model,
        stream: true,
        temperature: config.defaultTemperature,
        max_tokens: 2000,
        messages: [
          { role: "system", content: blogContentDraftPrompt.system },
          {
            role: "user",
            content: blogContentDraftPrompt.buildUser({
              title: body.title,
              excerpt: body.excerpt,
            }),
          },
        ],
      }),
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: "AI stream başlatılamadı" }, { status: 502 });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstream.body!.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;

              const payload = trimmed.slice(5).trim();
              if (payload === "[DONE]") continue;

              try {
                const parsed = JSON.parse(payload) as {
                  choices?: Array<{ delta?: { content?: string } }>;
                };
                const chunk = parsed.choices?.[0]?.delta?.content;
                if (chunk) controller.enqueue(encoder.encode(chunk));
              } catch {
                // skip malformed SSE chunks
              }
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }
}
