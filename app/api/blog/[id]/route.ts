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

// ✅ Corrected function signature for Next.js App Router
export async function GET(
  req: NextRequest,
  context: { params?: { id?: string } } // ✅ Ensure `params` is optional and avoid direct destructuring
) {
  try {
    // Ensure `params` exists before accessing `id`
    if (!context.params || !context.params.id) {
      return NextResponse.json({ error: "Missing blog post ID" }, { status: 400 });
    }

    const { id } = context.params; // ✅ Extract `id` safely

    // Convert ID from string to number
    const requestedId = Number(id);
    if (isNaN(requestedId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Fetch articles from Redis
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

    // Find post by ID
    const post = articles.find((article) => article.id === requestedId);

    if (!post) {
      console.log("❌ Post not found for ID:", requestedId);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    console.log("✅ Post found:", post);
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}
