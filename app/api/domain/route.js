import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = 'force-dynamic';

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function getCredentials() {
  const config = (await redis.get("audio_fusion_config")) || {};
  const token = process.env.VERCEL_API_TOKEN || config.vercelToken || "";
  const projectId = process.env.VERCEL_PROJECT_ID || config.vercelProjectId || "";
  const teamId = process.env.VERCEL_TEAM_ID || config.vercelTeamId || "";

  return { token, projectId, teamId };
}

// GET /api/domain?domain=my-domain.com
// Checks validation status on Vercel
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json({ error: "Missing domain query parameter" }, { status: 400 });
    }

    const { token, projectId, teamId } = await getCredentials();
    if (!token || !projectId) {
      return NextResponse.json({ 
        error: "Credentials missing", 
        setupRequired: true 
      }, { status: 200 });
    }

    const teamParam = teamId ? `?teamId=${teamId}` : "";
    const res = await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains/${domain}${teamParam}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 404) {
      return NextResponse.json({ status: "not-added", verified: false });
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error("Vercel Domain Config API Error:", errText);
      return NextResponse.json({ error: "Failed to fetch domain status from Vercel" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Domain Config Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/domain
// Body: { domain: "my-domain.com" }
// Adds the domain to the Vercel project configuration
export async function POST(request) {
  try {
    const { domain } = await request.json();
    if (!domain) {
      return NextResponse.json({ error: "Missing domain name in body" }, { status: 400 });
    }

    const { token, projectId, teamId } = await getCredentials();
    if (!token || !projectId) {
      return NextResponse.json({ 
        error: "Credentials missing. Please set Vercel API Token and Project ID in settings.", 
        setupRequired: true 
      }, { status: 400 });
    }

    const teamParam = teamId ? `?teamId=${teamId}` : "";
    const res = await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains${teamParam}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: domain }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Vercel Domain Add API Error:", data);
      return NextResponse.json({ error: data.error?.message || "Failed to add domain to Vercel" }, { status: res.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("POST Domain Add Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/domain?domain=my-domain.com
// Removes the domain from the Vercel project configuration
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json({ error: "Missing domain parameter" }, { status: 400 });
    }

    const { token, projectId, teamId } = await getCredentials();
    if (!token || !projectId) {
      return NextResponse.json({ error: "Credentials missing" }, { status: 400 });
    }

    const teamParam = teamId ? `?teamId=${teamId}` : "";
    const res = await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains/${domain}${teamParam}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Vercel Domain Delete API Error:", data);
      return NextResponse.json({ error: data.error?.message || "Failed to delete domain from Vercel" }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Domain Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
