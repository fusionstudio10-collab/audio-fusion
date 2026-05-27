import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let videoId = searchParams.get("id");

  if (!videoId) {
    return NextResponse.json({ error: "Missing video ID or URL" }, { status: 400 });
  }

  // If user pasted a full URL, extract the ID
  if (videoId.includes("youtube.com") || videoId.includes("youtu.be")) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoId.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
  }

  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch YouTube data");
    }

    const data = await response.json();
    
    return NextResponse.json({
      title: data.title,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      videoId: videoId
    });
  } catch (error) {
    console.error("YouTube Fetch Error:", error);
    return NextResponse.json(
      { error: "Could not fetch video details", details: error.message },
      { status: 500 }
    );
  }
}
