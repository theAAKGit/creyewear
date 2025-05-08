import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

// Reuse your real types
interface Customer {
  name: string;
  lastname: string;
  address: string;
  email: string;
  phone: string;
}

interface CartItem {
  name: string;
  quantity: number;
}

interface InventoryProduct {
  name: string;
  inventory?: number;
  hidden?: boolean;
  // add more fields from your product structure as needed:
  [key: string]: unknown;
}

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

    const {
      customer,
      cart,
      amount,
    }: { customer: Customer; cart: CartItem[]; amount: number } =
      typeof rawData === "string" ? JSON.parse(rawData) : rawData;

    const productsRaw = await redis.get("products");
    const products = typeof productsRaw === "string" ? JSON.parse(productsRaw) : productsRaw;

    let updated = false;

    for (const item of cart) {
      const product = (products as InventoryProduct[]).find((p) => p.name === item.name);

      if (product && typeof product.inventory === "number") {
        product.inventory = Math.max(0, product.inventory - item.quantity);
        if (product.inventory === 0) {
          product.hidden = true;
        }
        updated = true;
      } else {
        console.warn(`⚠️ Product not found or missing inventory: ${item.name}`);
      }
    }

    if (updated) {
      await redis.set("products", JSON.stringify(products));
      console.log("✅ Inventory updated after purchase");
    }

    const productSummary = cart
      .map((p) => `• ${p.name} (x${p.quantity})`)
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
      to: "creyewearmx@gmail.com",
      subject: `🧾 Nueva orden en Creyewear`,
      text: summary,
    });

    return NextResponse.json({ message: "✅ Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in send-mail route:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
