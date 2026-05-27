import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { defaultConfig } from "../../lib/defaultConfig";

// Initialize Upstash Redis client
// It automatically uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
const redis = Redis.fromEnv();

export async function GET() {
  try {
    const config = await redis.get("audio_fusion_config");
    if (!config) {
      return NextResponse.json(defaultConfig);
    }
    return NextResponse.json(config);
  } catch (error) {
    console.error("Vercel Upstash KV GET Error:", error);
    // Fallback to default config if DB fails locally without env vars
    return NextResponse.json(defaultConfig);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await redis.set("audio_fusion_config", body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vercel Upstash KV POST Error:", error);
    return NextResponse.json({ error: "Failed to save configuration" }, { status: 500 });
  }
}
