import { NextResponse } from "next/server";

function getYouTubeId(urlOrId) {
  if (!urlOrId) return "";
  let url = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  try {
    if (url.includes("/shorts/")) {
      const parts = url.split("/shorts/");
      if (parts[1]) return parts[1].split(/[?#&]/)[0].substring(0, 11);
    }
    if (url.includes("watch?v=")) {
      const parts = url.split("watch?v=");
      if (parts[1]) return parts[1].split(/[?#&]/)[0].substring(0, 11);
    }
    if (url.includes("youtu.be/")) {
      const parts = url.split("youtu.be/");
      if (parts[1]) return parts[1].split(/[?#&]/)[0].substring(0, 11);
    }
    if (url.includes("/embed/")) {
      const parts = url.split("/embed/");
      if (parts[1]) return parts[1].split(/[?#&]/)[0].substring(0, 11);
    }
    const regExp = /^.*(?:v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[1] && match[1].length === 11) {
      return match[1];
    }
    if (url.startsWith("http")) {
      const parsedUrl = new URL(url);
      const v = parsedUrl.searchParams.get("v");
      if (v && v.length === 11) return v;
    }
  } catch (e) {
    console.error("Error parsing YouTube ID:", e);
  }
  return url;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let videoId = searchParams.get("id");

  if (!videoId) {
    return NextResponse.json({ error: "Missing video ID or URL" }, { status: 400 });
  }

  // If user pasted a full URL, extract the ID robustly
  videoId = getYouTubeId(videoId);


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
