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

    // Step 1: Get phone from clip:lookup
    let phone: string | null = null;

    if (code) {
      phone = await redis.hget("clip:lookup", code);
    }
    if (!phone && orderId) {
      phone = await redis.hget("clip:lookup", orderId);
    }

    if (!phone) {
      console.warn("⚠️ No phone found in clip:lookup for code/orderId");
      return NextResponse.json({ message: "Customer not found" }, { status: 200 });
    }

    // Step 2: Get customer data using phone from clients hash
    const customerRaw = await redis.hget("clients", phone);

    if (!customerRaw) {
      console.warn("⚠️ Phone found but customer data missing:", phone);
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

    console.log("✅ Email sent to notify new transaction from", customer.phone);
    return NextResponse.json({ message: "Email sent & webhook processed" }, { status: 200 });
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
