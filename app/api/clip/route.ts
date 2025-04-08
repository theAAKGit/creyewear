import { NextResponse } from "next/server";

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

    // Create the request body as specified by the Clip API
    const requestBody = {
      amount: data.amount,
      currency: "MXN",
      purchase_description: data.description,
      redirection_url: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/store/checkout/redirection/success`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL}/store/checkout/redirection/error`,
        default: `${process.env.NEXT_PUBLIC_BASE_URL}/store/checkout/redirection/default`,
      },
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

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("🚨 Error creating payment link:", errorMessage);
    return NextResponse.json(
      { error: "Failed to create payment link", details: errorMessage },
      { status: 500 }
    );
  }
}
