import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

const redis = Redis.fromEnv();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  try {
    const rawData = await redis.get(`clients:${orderId}`);

    if (!rawData) {
      return NextResponse.json({ error: "Order not found in Redis" }, { status: 404 });
    }

    const { customer, cart, amount } = typeof rawData === "string" ? JSON.parse(rawData) : rawData;

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

💳 Monto: $${amount}
    `;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "jrf2421@gmail.com", // 📩 your friend's email
      subject: `🧾 Nueva orden en Creyewear`,
      text: summary,
    });

    return NextResponse.json({ message: "✅ Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in send-mail route:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
