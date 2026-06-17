import { NextResponse } from "next/server";

import { permissions } from "@/config/permissions";
import { requirePermission } from "@/lib/authorization/guards";
import { mediaService } from "@/features/media/services";

export async function POST(request: Request) {
  try {
    const user = await requirePermission(permissions.media.upload);
    const formData = await request.formData();

    const file = formData.get("file");
    const folderSlug = (formData.get("folderSlug") as string) || "general";
    const alt = (formData.get("alt") as string) || undefined;
    const caption = (formData.get("caption") as string) || undefined;
    const propertyId = (formData.get("propertyId") as string) || undefined;

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Dosya bulunamadı" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await mediaService.upload(
      buffer,
      {
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        folderSlug,
        alt,
        caption,
        propertyId,
      },
      user.id,
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    if (propertyId) {
      const { propertyMediaService } = await import("@/features/media/services");
      const mimeType = file.type || "";
      if (mimeType.startsWith("video/")) {
        await propertyMediaService.addVideoFromMedia(propertyId, result.data.id, caption);
      } else {
        await propertyMediaService.addImageFromLibrary(propertyId, result.data.id, alt);
      }
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, error: "Yükleme yetkilendirmesi başarısız" },
      { status: 401 },
    );
  }
}
