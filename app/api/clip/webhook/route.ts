import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("🔔 Clip webhook received:", data);

    const status = data?.resource_status;
    const reference = data?.me_reference_id;

    if (!reference) {
      console.warn("⚠️ Missing customer info in me_reference_id");
      return NextResponse.json({ message: "No customer info provided" }, { status: 200 });
    }

    const customer = JSON.parse(reference); // The object we embedded earlier

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

    // Send email via Resend
    await resend.emails.send({
      from: "notificaciones@creyewear.com",
      to: "jrf2421@gmail.com",
      subject,
      text: summary,
    });

    return NextResponse.json({ message: "Email sent & webhook processed" }, { status: 200 });

  } catch (error) {
    console.error("❌ Error in Clip webhook:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
