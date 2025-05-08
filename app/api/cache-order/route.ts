// app/api/cache-order/route.ts
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  try {
    const { orderId, customer, cart, amount } = await req.json();

    if (!orderId || !customer || !cart || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await redis.set(`clients:${orderId}`, JSON.stringify({ customer, cart, amount }));

    return NextResponse.json({ message: "Order cached in Redis" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error caching order:", error);
    return NextResponse.json({ error: "Failed to cache order" }, { status: 500 });
  }
}
