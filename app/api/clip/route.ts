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

    const requestBody = {
      amount: data.amount,
      currency: "MXN",
      purchase_description: data.description,
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

    // Save the payment_request_id -> customer mapping in Redis
    const paymentId = result.payment_request_id;
    if (paymentId && data.customer) {
      await redis.set(`clip:${paymentId}`, JSON.stringify(data.customer), { ex: 3600 }); // expires in 1 hour
      console.log("💾 Saved customer info in Redis for:", paymentId);
    } else {
      console.warn("⚠️ Missing payment_request_id or customer info, not saving to Redis.");
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
