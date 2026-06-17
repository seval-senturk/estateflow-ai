import { NextResponse } from "next/server";

import { appConfig } from "@/config/app";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: appConfig.name,
    version: appConfig.version,
    timestamp: new Date().toISOString(),
  });
}
