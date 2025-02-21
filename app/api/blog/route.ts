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
  image?: string; // Optional thumbnail
}

// ✅ GET all articles
export async function GET() {
  try {
    const articlesData = await redis.get("blog:articles");
    
    let articles: BlogArticle[] = [];

    if (typeof articlesData === "string") {
      articles = JSON.parse(articlesData);
    } else if (Array.isArray(articlesData)) {
      articles = articlesData as BlogArticle[];
    }

    return NextResponse.json({ articles }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

// ✅ POST - Add a new article
export async function POST(req: NextRequest) {
  try {
    const newArticle: BlogArticle = await req.json();

    // Fetch existing articles
    const articlesData = await redis.get("blog:articles");
    let articles: BlogArticle[] = [];

    if (typeof articlesData === "string") {
      articles = JSON.parse(articlesData);
    } else if (Array.isArray(articlesData)) {
      articles = articlesData as BlogArticle[];
    }

    // Add the new article
    articles.push(newArticle);
    await redis.set("blog:articles", JSON.stringify(articles));

    return NextResponse.json({ message: "Article added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error saving article to Redis:", error);
    return NextResponse.json({ error: "Failed to save article" }, { status: 500 });
  }
}
