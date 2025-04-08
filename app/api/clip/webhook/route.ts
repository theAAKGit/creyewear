import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("🔔 Webhook received:", data);

    // You can add your logic here to update order status based on the received data
    return NextResponse.json({ message: "Webhook received successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}
