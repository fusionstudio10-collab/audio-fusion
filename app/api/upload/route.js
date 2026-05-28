import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary with server-side secrets
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "audio-fusion";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder,
      resource_type: "auto",
      transformation: [
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { url } = await request.json();
    
    if (!url || !url.includes("res.cloudinary.com")) {
      return NextResponse.json({ error: "Invalid Cloudinary URL" }, { status: 400 });
    }

    // Extract public_id from Cloudinary URL robustly
    const parts = url.split('/');
    const uploadDirIndex = parts.findIndex(p => p === "upload" || p === "video" || p === "raw");
    if (uploadDirIndex === -1) {
      return NextResponse.json({ error: "Invalid Cloudinary URL structure" }, { status: 400 });
    }

    let remainingParts = parts.slice(uploadDirIndex + 1);
    
    // Strip transformation segment if present (e.g., c_fill,w_300 or similar containing commas/underscores)
    if (remainingParts[0] && (remainingParts[0].includes(",") || (remainingParts[0].includes("_") && !remainingParts[0].startsWith("v")))) {
      remainingParts.shift();
    }
    
    // Strip version segment if present (e.g., v1716762391 or similar v+digits)
    if (remainingParts[0] && remainingParts[0].startsWith("v") && /^\d+$/.test(remainingParts[0].substring(1))) {
      remainingParts.shift();
    }

    const fileWithExtension = remainingParts.join('/');
    const publicId = fileWithExtension.substring(0, fileWithExtension.lastIndexOf('.')) || fileWithExtension;

    // Determine the resource_type based on the URL parts
    const resourceType = parts[uploadDirIndex - 1] || "image";

    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return NextResponse.json(
      { error: "Delete failed", details: error.message },
      { status: 500 }
    );
  }
}
