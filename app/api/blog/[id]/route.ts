import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// Initialize Redis
const redis = Redis.fromEnv();

interface BlogArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  image?: string;
}

// ✅ Fully Typed Function
export async function GET(req: NextRequest, context: { params: { id?: string } }) {
  try {
    const postId = context.params?.id;

    if (!postId) {
      return NextResponse.json({ error: "Missing blog post ID" }, { status: 400 });
    }

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

    console.log("🔍 Searching for post with ID:", postId);
    console.log("📝 Available IDs in Redis:", articles.map(a => a.id));

    // ✅ Find post by string ID
    const post = articles.find((article) => article.id === postId);

    if (!post) {
      console.log("❌ Post not found for ID:", postId);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    console.log("✅ Post found:", post);
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("🚨 Error fetching blog post:", error);
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}
