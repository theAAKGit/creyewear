"use client";
import { useState } from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  type?: "product" | "blog"; // ✅ Add type to distinguish between products and blogs
}

const ImageUpload = ({ onUpload, currentImage, type = "product" }: ImageUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(currentImage || "");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;

    const file = event.target.files[0];
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const endpoint = type === "product" ? "/api/products" : "/api/blog-upload"; // ✅ Dynamically adjust endpoint
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        onUpload(data.url); // ✅ Pass the uploaded image URL to the parent component
        setPreview(data.url);
      } else {
        alert("Error uploading file.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div
        className="w-full h-40 border border-gray-300 rounded-md flex items-center justify-center relative cursor-pointer hover:border-blue-500 transition"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-md" />
        ) : (
          <span className="text-gray-400">Drag and drop or click to upload</span>
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>
      {loading && <p className="text-gray-500 text-sm mt-2">Uploading...</p>}
    </div>
  );
};

export default ImageUpload;
