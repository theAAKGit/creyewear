import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Initialize Redis
const redis = Redis.fromEnv();

export async function POST(req: Request) {
  try {
    console.log("🔄 Initializing Clip payment link creation...");

    const { CLIP_AUTH_TOKEN, CLIP_ENDPOINT } = process.env;

    if (!CLIP_AUTH_TOKEN || !CLIP_ENDPOINT) {
      console.error("🚨 Missing Clip environment variables");
      return NextResponse.json(
        { error: "Server configuration error: Missing Clip environment variables" },
        { status: 500 }
      );
    }

    const data = await req.json();
    console.log("📦 Received payment data:", data);

    const orderId = `order_${Date.now()}`; // Custom internal order ID

    const requestBody = {
      amount: data.amount,
      currency: "MXN",
      purchase_description: data.description,
      merch_inv_id: orderId, // Custom ID for later lookup
      redirection_url: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/store/checkout/redirection/success`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL}/store/checkout/redirection/error`,
        default: `${process.env.NEXT_PUBLIC_BASE_URL}/store/checkout/redirection/default`,
      },
      webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/clip/webhook`,
    };

    console.log("🔗 Sending request to Clip API:", requestBody);

    const response = await fetch(CLIP_ENDPOINT, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": `Basic ${CLIP_AUTH_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Clip API response error:", errorText);
      return NextResponse.json(
        { error: "Failed to create payment link", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("✅ Payment link created successfully:", result);

    const paymentId = result.payment_request_id;

    if (paymentId && data.customer) {
      const customerString = JSON.stringify(data.customer);
      await redis.set(`clip:payment:${paymentId}`, customerString, { ex: 3600 });
      await redis.set(`clip:order:${orderId}`, customerString, { ex: 3600 });
      console.log("💾 Saved customer info in Redis for:", paymentId, "and", orderId);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error("🚨 Error creating payment link:", message);
    return NextResponse.json(
      { error: "Failed to create payment link", details: message },
      { status: 500 }
    );
  }
}
