// ImgBB Free Image Uploader Service
// Does not require credit cards or billing setup

export async function uploadToImgBB(file) {
  try {
    const formData = new FormData();
    formData.append("image", file);

    // Free API Key for Audio Fusion project
    // ImgBB API key can also be customized if needed
    const apiKey = "8a2ee343be7c5a0833a69a0a0fb0e386"; 
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    
    if (result.success) {
      return result.data.url;
    } else {
      throw new Error(result.error?.message || "ImgBB upload error");
    }
  } catch (error) {
    console.error("ImgBB upload failed:", error);
    throw error;
  }
}
