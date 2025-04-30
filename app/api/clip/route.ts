import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function POST(req: Request) {
  try {
    const { CLIP_AUTH_TOKEN, CLIP_ENDPOINT } = process.env;

    if (!CLIP_AUTH_TOKEN || !CLIP_ENDPOINT) {
      console.error("🚨 Missing Clip environment variables");
      return NextResponse.json({ error: "Missing config" }, { status: 500 });
    }

    const data = await req.json();
    const internalOrderId = `order_${Date.now()}`;
    const customer = data.customer;

    if (!customer || !customer.phone) {
      return NextResponse.json({ error: "Missing customer or phone number" }, { status: 400 });
    }

    const requestBody = {
      amount: data.amount,
      currency: "MXN",
      purchase_description: data.description,
      merch_inv_id: internalOrderId,
      redirection_url: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/store/checkout/redirection/success`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL}/store/checkout/redirection/error`,
        default: `${process.env.NEXT_PUBLIC_BASE_URL}/store/checkout/redirection/default`,
      },
      webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/clip/webhook`,
    };

    const response = await fetch(CLIP_ENDPOINT, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Basic ${CLIP_AUTH_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to create payment link", details: result }, { status: response.status });
    }

    const paymentCode = result.payment_request_code;
    const customerString = JSON.stringify(customer);

    await redis.hset("clients", { [customer.phone]: customerString });

    if (paymentCode) {
      await redis.hset("clip:lookup", { [paymentCode]: customer.phone });
    }
    await redis.hset("clip:lookup", { [internalOrderId]: customer.phone });


    console.log("💾 Stored customer under phone:", customer.phone);
    console.log("🔗 Linked IDs to phone:", paymentCode, internalOrderId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("🚨 Clip route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
