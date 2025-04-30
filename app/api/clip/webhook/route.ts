import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📩 Webhook body:", JSON.stringify(body, null, 2));

    const encoded = body?.payment_detail?.merch_inv_id;
    const status = body?.payment_detail?.status_description || "N/A";

    if (!encoded) {
      console.warn("⚠️ No customer data found in merch_inv_id");
      return NextResponse.json({ message: "Missing customer info" }, { status: 200 });
    }

    const customer = JSON.parse(Buffer.from(encoded, "base64").toString("utf-8"));

    const summary = `
      👤 Cliente: ${customer.name} ${customer.lastname}
      📬 Dirección: ${customer.address}
      📧 Correo: ${customer.email}
      📱 Teléfono: ${customer.phone}

      💳 Estatus del pago: ${status}
      📅 Fecha: ${body?.payment_detail?.payment_date || "N/A"}
    `;

    await resend.emails.send({
      from: "jrf2421@gmail.com",
      to: "jrf2421@gmail.com",
      subject: `🧾 Nueva transacción ${status} en Creyewear`,
      text: summary,
    });

    console.log("✅ Email sent to jrf2421@gmail.com");
    return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
