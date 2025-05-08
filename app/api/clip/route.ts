import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { CLIP_AUTH_TOKEN, CLIP_ENDPOINT, NEXT_PUBLIC_BASE_URL } = process.env;
    if (!CLIP_AUTH_TOKEN || !CLIP_ENDPOINT || !NEXT_PUBLIC_BASE_URL) {
      return NextResponse.json({ error: "Missing Clip config" }, { status: 500 });
    }

    const data = await req.json();
    const customer = data.customer;
    const cart = data.cart || [];
    const orderId = data.orderId || `order_${Date.now()}`;

    // ✅ Prepare simple Clip request (no customer data here)
    const requestBody = {
      amount: data.amount,
      currency: "MXN",
      purchase_description: `Compra en Creyewear - ${orderId}`,
      redirection_url: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/store/checkout/redirection/success?orderId=${orderId}`,
        error: `${NEXT_PUBLIC_BASE_URL}/store/checkout/redirection/error`,
        default: `${NEXT_PUBLIC_BASE_URL}/store/checkout/redirection/default`,
      },
      webhook_url: `${NEXT_PUBLIC_BASE_URL}/api/clip/webhook`,
    };

    console.log("📤 Sending to Clip:", requestBody);

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
      return NextResponse.json({ error: "Clip error", details: result }, { status: response.status });
    }

    // ✅ Email summary for store owner
    const productSummary = cart
      .map((p: { name: string; quantity: number }) => `• ${p.name} (x${p.quantity})`)
      .join("\n");

    const summary = `
👤 Cliente: ${customer.name} ${customer.lastname}
📬 Dirección: ${customer.address}
📧 Correo: ${customer.email}
📱 Teléfono: ${customer.phone}

🛍️ Productos:
${productSummary}

💳 Monto: $${data.amount}
    `;

    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "jrf2421@gmail.com",
        subject: `🧾 Nueva orden en Creyewear`,
        text: summary,
      });
      console.log("✅ Email sent immediately after payment link creation");
    } catch (e) {
      console.error("❌ Resend failed:", e);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ Clip route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
