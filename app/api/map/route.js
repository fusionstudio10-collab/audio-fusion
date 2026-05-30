import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    // Node/Next.js fetch follows redirects by default. 
    // We fetch with a user-agent to mimic a browser, avoiding bot block headers.
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
      }
    });

    return NextResponse.json({
      resolvedUrl: response.url
    });
  } catch (error) {
    console.error("Map redirect resolution error:", error);
    return NextResponse.json(
      { error: "Failed to resolve redirect", details: error.message },
      { status: 500 }
    );
  }
}
