import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = 'force-dynamic';
import { defaultConfig } from "../../lib/defaultConfig";

// Initialize Upstash Redis client explicitly with KV variables
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET() {
  try {
    const config = await redis.get("audio_fusion_config");
    if (!config) {
      return NextResponse.json(defaultConfig);
    }
    
    // Fallback: If DB has an older sectionsOrder without 'posters', inject it
    if (config.sectionsOrder && !config.sectionsOrder.includes("posters")) {
      const servicesIndex = config.sectionsOrder.indexOf("services");
      if (servicesIndex !== -1) {
        config.sectionsOrder.splice(servicesIndex + 1, 0, "posters");
      } else {
        config.sectionsOrder.push("posters");
      }
    }
    
    // Fallback: If DB is missing testimonials array, provide the default ones
    if (!config.testimonials) {
      config.testimonials = defaultConfig.testimonials;
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
