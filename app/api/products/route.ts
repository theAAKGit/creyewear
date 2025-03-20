import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";


// Initialize Redis
const redis = Redis.fromEnv();

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  originalPrice: number;
  discount: string;
  price: number; 
  sizes?: string[];
}

// GET: Fetch All Products with Correct Discount Applied
export async function GET() {
  try {
    const productsData = await redis.get("products");

    let products: Product[] = [];

    if (typeof productsData === "string") {
      products = JSON.parse(productsData);
    } else if (Array.isArray(productsData)) {
      products = productsData as Product[];
    }

    return NextResponse.json({
      products: products.map((product) => {
        const originalPrice = product.originalPrice || 0;
        const discount = product.discount || "0";

        const discountAmount = discount.endsWith("%")
          ? (originalPrice * parseFloat(discount)) / 100
          : parseFloat(discount) || 0;

        return {
          ...product,
          image: product.image || "/images/placeholder.png", // ✅ Default if missing
          price: Math.max(originalPrice - discountAmount, 0) || 0,
          sizes: Array.isArray(product.sizes) ? product.sizes : [],
        };
      }),
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products from Redis:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Handle image upload separately — No product creation
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as Blob | null;
      if (file) {
        // ✅ Generate unique filename
        const fileName = `store-images/${Date.now()}-${Math.random().toString(36).substring(7)}`;

        // ✅ Upload to Vercel Blob
        const { url } = await put(fileName, file, { access: "public" });

        // ✅ Return the URL
        return NextResponse.json({ url }, { status: 200 });
      } else {
        console.log("No file provided — Skipping file upload.");
      }
    }

    // ✅ Handle product creation — Separate from image upload
    if (contentType.includes("application/json")) {
      const { product } = await req.json();

      if (!product || !product.id) {
        return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
      }

      // ✅ Fetch existing products
      const productsData = await redis.get("products");
      let products: Product[] = [];

      if (typeof productsData === "string") {
        products = JSON.parse(productsData);
      } else if (Array.isArray(productsData)) {
        products = productsData as Product[];
      }

      // ✅ Calculate price based on discount
      const originalPrice = product.originalPrice || 0;
      const discount = product.discount || "0";
      const discountAmount = discount.endsWith("%")
        ? (originalPrice * parseFloat(discount)) / 100
        : parseFloat(discount) || 0;

      const newProduct: Product = {
        ...product,
        price: Math.max(originalPrice - discountAmount, 0),
        sizes: Array.isArray(product.sizes) ? product.sizes : [],
        image: product.image || "/images/placeholder.png", // ✅ Provide default image if missing
      };

      // ✅ Add new product to list
      products.push(newProduct);

      await redis.set("products", JSON.stringify(products));

      return NextResponse.json(
        { message: "Product added successfully", product: newProduct },
        { status: 200 }
      );
    }

    // ✅ Catch invalid requests
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}


// PUT: Update Products in Redis
export async function PUT(req: NextRequest) {
  try {
    const { products } = await req.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "Invalid products format" }, { status: 400 });
    }

    await redis.get("products"); // ✅ Remove unused variable, but still fetch existing data to avoid errors

    const updatedProducts = products.map((newProduct) => {
      const originalPrice = newProduct.originalPrice || 0;
      const discount = newProduct.discount || "0";

      const discountAmount = discount.endsWith("%")
        ? (originalPrice * parseFloat(discount)) / 100
        : parseFloat(discount) || 0;

      const calculatedPrice = Math.max(originalPrice - discountAmount, 0); 

      return {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        category: newProduct.category || "uncategorized",
        image: newProduct.image && newProduct.image !== "" ? newProduct.image : "/images/placeholder.png",
        originalPrice: newProduct.originalPrice,
        discount: newProduct.discount,
        price: calculatedPrice, 
        sizes: Array.isArray(newProduct.sizes) ? newProduct.sizes : [], // ✅ Ensure sizes are always an array
      };
    });

    await redis.set("products", JSON.stringify(updatedProducts));

    return NextResponse.json({ message: "Products updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving products to Redis:", error);
    return NextResponse.json({ error: "Failed to update products" }, { status: 500 });
  }
}

// Delete: Delete Products 
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (typeof id !== "number") {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const existingProductsData = await redis.get("products");
    let existingProducts: Product[] = [];

    if (typeof existingProductsData === "string") {
      existingProducts = JSON.parse(existingProductsData);
    } else if (Array.isArray(existingProductsData)) {
      existingProducts = existingProductsData as Product[];
    }

    // ✅ Find product to delete
    const productToDelete = existingProducts.find((product) => product.id === id);

    if (!productToDelete) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // ✅ Delete image from Vercel Blob if it exists
    if (productToDelete.image && !productToDelete.image.includes("/placeholder.png")) {
      const fileName = productToDelete.image.split("/").pop(); // Extract file name
      await fetch(`https://api.vercel.com/v1/blobs/${fileName}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        },
      });
    }

    // ✅ Remove product from list
    const updatedProducts = existingProducts.filter((product) => product.id !== id);

    await redis.set("products", JSON.stringify(updatedProducts));

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}




