import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

const redis = Redis.fromEnv();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📩 Webhook body:", JSON.stringify(body, null, 2));

    const status = body?.payment_detail?.status_description || body?.payment_request_detail?.status_description;
    const orderId = body?.payment_detail?.order_id;
    const code = body?.payment_request_detail?.payment_request_code;

    let customerRaw = null;

    if (code) {
      customerRaw = await redis.get(`clip:code:${code}`);
    }
    if (!customerRaw && orderId) {
      customerRaw = await redis.get(`clip:order:${orderId}`);
    }

    if (!customerRaw) {
      console.warn("⚠️ No customer info found in Redis for code/order_id");
      return NextResponse.json({ message: "No customer data found" }, { status: 200 });
    }

    const customer = JSON.parse(customerRaw as string);

    const summary = `
      👤 Cliente: ${customer.name} ${customer.lastname}
      📬 Dirección: ${customer.address}
      📧 Correo: ${customer.email}
      📱 Teléfono: ${customer.phone}

      💳 Estatus del pago: ${status}
      🧾 ID de transacción: ${orderId || code || "N/A"}
      📅 Fecha: ${body?.payment_detail?.payment_date || "N/A"}
    `;

    await resend.emails.send({
      from: "notificaciones@creyewear.com",
      to: "jrf2421@gmail.com",
      subject: `🧾 Nueva transacción ${status} en Creyewear`,
      text: summary,
    });

    console.log("✅ Email sent successfully.");
    return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
  } catch (err) {
    console.error("❌ Error in webhook handler:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
