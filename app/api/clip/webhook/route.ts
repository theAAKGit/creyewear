import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { Redis } from "@upstash/redis";

// Initialize Redis
const redis = Redis.fromEnv();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("📩 Raw webhook body:", JSON.stringify(data, null, 2));

    const status = data?.resource_status;
    const paymentId = data?.payment_request_id;

    if (!paymentId) {
      console.warn("⚠️ Webhook missing payment_request_id");
      return NextResponse.json({ message: "No payment_request_id in webhook" }, { status: 200 });
    }

    const customerRaw = await redis.get(`clip:${paymentId}`);

    if (!customerRaw) {
      console.warn("⚠️ No customer info found in Redis for:", paymentId);
      return NextResponse.json({ message: "No customer data found" }, { status: 200 });
    }

    const customer = JSON.parse(customerRaw as string);

    const subject = `🧾 Nueva transacción ${status} en Creyewear`;
    const summary = `
      👤 Cliente: ${customer.name} ${customer.lastname}
      📬 Dirección: ${customer.address}
      📧 Correo: ${customer.email}
      📱 Teléfono: ${customer.phone}

      💳 Estatus del pago: ${status}
      🧾 ID de transacción: ${data.transaction_id || "N/A"}
      📅 Fecha: ${data.payment_date || data.sent_date || "N/A"}
    `;

    await resend.emails.send({
      from: "notificaciones@creyewear.com",
      to: "jrf2421@gmail.com",
      subject,
      text: summary,
    });

    console.log("📧 Email sent for transaction:", data.transaction_id);

    return NextResponse.json({ message: "Email sent & webhook processed" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in Clip webhook:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
