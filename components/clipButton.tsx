"use client";
import { useState } from "react";

interface CustomerInfo {
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

interface ClipButtonProps {
  total: number;
  customer: CustomerInfo;
  cart: CartItem[];
}

export default function ClipButton({ total, customer, cart }: ClipButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (
      !customer.name ||
      !customer.lastname ||
      !customer.address ||
      !customer.email ||
      !customer.phone
    ) {
      alert("Por favor, completa todos los campos de entrega y contacto.");
      return;
    }

    if (total <= 0) {
      alert("El total debe ser mayor a $0.");
      return;
    }

    setLoading(true);
    try {
      console.log("👤 Customer info being sent to API:", customer);
      console.log("🛍️ Cart info being sent to API:", cart);

      const encoded = Buffer.from(
        JSON.stringify({ ...customer, cart })
      ).toString("base64");

      const response = await fetch("/api/clip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "MXN",
          purchase_description: encoded,
          redirection_url: {
            success: "https://creyewear.com.mx/store/checkout/redirection/success",
            error: "https://creyewear.com.mx/store/checkout/redirection/error",
            default: "https://creyewear.com.mx/store/checkout/redirection/default",
          },
          webhook_url: "https://creyewear.com.mx/api/clip/webhook",
        }),
      });

      const data = await response.json();

      if (data.payment_request_url) {
        window.location.href = data.payment_request_url;
      } else {
        alert("Error al generar el link de pago");
        console.error("Clip API error response:", data);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Hubo un error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className={`w-full bg-orange-600 text-white p-4 rounded-md font-semibold transition ${
        loading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-700"
      }`}
      disabled={loading}
    >
      {loading ? "Procesando..." : "Pagar con Clip"}
    </button>
  );
}
