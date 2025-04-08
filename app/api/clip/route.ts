import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("🔄 Initializing Clip payment link creation...");

    const { CLIP_API, CLIP_SECRET, CLIP_ENDPOINT } = process.env;

    if (!CLIP_API || !CLIP_SECRET || !CLIP_ENDPOINT) {
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
        success: "http://localhost:3000/store/checkout/redirection/success",
        error: "http://localhost:3000/store/checkout/redirection/error",
        default: "http://localhost:3000/store/checkout/redirection/default",
      },      
    };

    console.log("🔗 Sending request to Clip API:", requestBody);

    const response = await fetch(CLIP_ENDPOINT, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": `Bearer ${CLIP_API}:${CLIP_SECRET}`,
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
