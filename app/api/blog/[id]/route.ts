import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// Initialize Redis
const redis = Redis.fromEnv();

interface BlogArticle {
  id: string; // ✅ Fix: Ensure ID is string to match Next.js route params
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  image?: string;
}

// ✅ GET a single blog post by ID
export async function GET(
  req: NextRequest,
  context: { params: { id: string } } // ✅ Fix: Next.js expects `context` with `params`
) {
  try {
    const { params } = context;

    // Ensure ID is provided
    if (!params.id) {
      return NextResponse.json({ error: "Missing blog post ID" }, { status: 400 });
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

    console.log("🔍 Searching for post with ID:", params.id);
    console.log("📝 Available IDs in Redis:", articles.map(a => a.id));

    // ✅ Find post by string ID (not number)
    const post = articles.find((article) => article.id === params.id);

    if (!post) {
      console.log("❌ Post not found for ID:", params.id);
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
