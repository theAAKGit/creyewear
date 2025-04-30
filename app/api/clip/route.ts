import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { CLIP_AUTH_TOKEN, CLIP_ENDPOINT } = process.env;
    if (!CLIP_AUTH_TOKEN || !CLIP_ENDPOINT) {
      return NextResponse.json({ error: "Missing Clip config" }, { status: 500 });
    }

    const data = await req.json();
    const customer = data.customer;

    const requestBody = {
      amount: data.amount,
      currency: "MXN",
      purchase_description: "Compra en Creyewear",
      redirection_url: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/store/checkout/redirection/success`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL}/store/checkout/redirection/error`,
        default: `${process.env.NEXT_PUBLIC_BASE_URL}/store/checkout/redirection/default`,
      },
      webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/clip/webhook`, // optional
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
      return NextResponse.json({ error: "Clip error", details: result }, { status: response.status });
    }

    // ✅ Send email immediately
    const summary = `
      👤 Cliente: ${customer.name} ${customer.lastname}
      📬 Dirección: ${customer.address}
      📧 Correo: ${customer.email}
      📱 Teléfono: ${customer.phone}
      💳 Monto: $${data.amount}
    `;

    try {
      await resend.emails.send({
        from: "jrf2421@gmail.com",
        to: "a01024815@tec.mx",
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
