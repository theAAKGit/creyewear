import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// Initialize Redis
const redis = Redis.fromEnv();

interface BlogArticle {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  date: string;
  image?: string;
}

// ✅ Workaround: Extract ID manually from URL
export async function GET(req: NextRequest) {
  try {
    // Extract pathname and get the ID manually
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Extracts the last part of the URL

    if (!id) {
      return NextResponse.json({ error: "Invalid request: Missing ID" }, { status: 400 });
    }

    // Convert ID from string to number
    const requestedId = Number(id);
    if (isNaN(requestedId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Fetch all articles from Redis
    const articlesData = await redis.get("blog:articles");

    if (!articlesData) {
      return NextResponse.json({ error: "No articles found" }, { status: 404 });
    }

    let articles: BlogArticle[] = [];

    if (typeof articlesData === "string") {
      articles = JSON.parse(articlesData);
    } else if (Array.isArray(articlesData)) {
      articles = articlesData as BlogArticle[];
    }

    console.log("🔍 Searching for post with ID:", requestedId);
    console.log("📝 Available IDs in Redis:", articles.map((a) => a.id));

    // ✅ Find the specific blog post by ID
    const post = articles.find((article) => article.id === requestedId);

    if (!post) {
      console.log("❌ Post not found for ID:", requestedId);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    console.log("✅ Post found:", post);
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}
