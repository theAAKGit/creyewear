import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import MarkdownIt from "markdown-it";

// Initialize Redis
const redis = Redis.fromEnv();
const md = new MarkdownIt();

interface Product {
  id: number;
  name: string;
  description?: string;
  secondaryDescription?: string;
  image?: string;
  originalPrice: number;
  discount: string;
  inventory?: number;
}

// ✅ GET: Fetch a Single Product by ID
export async function GET(req: NextRequest) {
  try {
    // Extract pathname and manually get ID from URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Extract last part of the URL

    if (!id) {
      return NextResponse.json({ error: "Invalid request: Missing ID" }, { status: 400 });
    }

    // Convert ID from string to number
    const requestedId = Number(id);
    if (isNaN(requestedId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    // Fetch all products from Redis
    const productsData = await redis.get("products");

    if (!productsData) {
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }

    // Ensure proper parsing
    const products: Product[] = typeof productsData === "string" ? JSON.parse(productsData) : productsData;

    
    // ✅ Find the specific product by ID
    const product = products.find((p) => p.id === requestedId);

    if (product) {
      product.description = product.description ? md.render(product.description) : "";
      product.secondaryDescription = product.secondaryDescription ? md.render(product.secondaryDescription) : "";
      product.inventory = typeof product.inventory === "number" ? product.inventory : 0; // ✅ default fallback
    }
    

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
