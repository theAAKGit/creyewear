"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext"; // adjust path as needed


interface CustomerInfo {
  name: string;
  lastname: string;
  address: string;
  email: string;
  phone: string;
}

export default function ClipButton({
  total,
  customer,
}: {
  total: number;
  customer: CustomerInfo;
}) {
  const [loading, setLoading] = useState(false);
  const { cart } = useCart();
  const handlePayment = async () => {

    if (!customer.name || !customer.lastname || !customer.address || !customer.email || !customer.phone) {
      alert("Por favor, completa todos los campos de entrega y contacto.");
      return;
    }
    
    setLoading(true);
    try {
      console.log("👤 Customer info being sent to API:", customer);
      const response = await fetch("/api/clip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          description: "Compra en Creyewear",
          customer, 
          cart,
          orderId: `order_${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (data.payment_request_url) {
        window.location.href = data.payment_request_url; // Redirect to Clip payment link
      } else {
        alert("Error al generar el link de pago");
        console.error("Clip API error response:", data);
        if (data && data.error) {
          console.error("Error from Clip API:", data.error);
        } else {
          console.error("Unexpected response format from Clip API:", data);
        }
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
