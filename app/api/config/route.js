import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { defaultConfig } from "../../lib/defaultConfig";

export async function GET() {
  try {
    const config = await kv.get("audio_fusion_config");
    if (!config) {
      return NextResponse.json(defaultConfig);
    }
    return NextResponse.json(config);
  } catch (error) {
    console.error("Vercel KV GET Error:", error);
    // Fallback to default config if DB fails locally without env vars
    return NextResponse.json(defaultConfig);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await kv.set("audio_fusion_config", body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vercel KV POST Error:", error);
    return NextResponse.json({ error: "Failed to save configuration" }, { status: 500 });
  }
}
