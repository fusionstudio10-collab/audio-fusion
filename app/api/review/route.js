import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { defaultConfig } from "../../lib/defaultConfig";

export const dynamic = 'force-dynamic';

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(request) {
  try {
    const { client, role, text, rating } = await request.json();

    if (!client || !role || !text) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    // Get current config
    let config = await redis.get("audio_fusion_config");
    if (!config) {
      config = { ...defaultConfig };
    }

    // Initialize array if it doesn't exist
    if (!config.testimonials) {
      config.testimonials = [];
    }

    // Build the new review
    const newReview = {
      client: client.trim(),
      role: role.trim(),
      text: text.trim(),
      rating: Number(rating) || 5,
      imageUrl: ""
    };

    // Prepend directly to testimonials list
    config.testimonials.unshift(newReview);

    // Save configuration back to Redis
    await redis.set("audio_fusion_config", config);

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error("Submit Review API Error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
