"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Article {
  id: number;
  title: string;
  content: string;
  date: string;
  image?: string; // Optional image property
}

export default function BlogPostPage() {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const numericId = Number(id); // 🔥 Convert to number
    if (isNaN(numericId)) {
      console.error("Invalid ID format:", id);
      setLoading(false);
      return;
    }

    console.log("Fetching blog post with ID:", numericId);

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${numericId}`);
        if (!response.ok) throw new Error(`Post not found (ID: ${numericId})`);
    
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };    

    fetchPost();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando artículo...</p>;
  }

  if (!post) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-3xl font-bold text-red-600">Artículo no encontrado</h1>
        <p className="text-gray-500">
          No pudimos encontrar este artículo. Quizás fue eliminado o nunca existió.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
      {/* Left Column: Title and Content */}
      <div>
        <h1 className="text-3xl font-bold text-[#19333F] mb-4">
          {post.title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Publicado el{" "}
          {new Date(post.date).toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="prose prose-lg text-[#19333F]">
          {post.content}
        </div>
      </div>
  
      {/**/}
      {/* Image beside text */}
      {post.image && (
        <div className="flex justify-center md:justify-end">
          <img
            src={post.image}
            alt={post.title}
            className="w-54 h-auto object-cover rounded-md"
          />
        </div>
      )}

    </div>
  );
  
  
}
