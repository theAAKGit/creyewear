"use client";
import { useState } from "react";

export default function ClipButton({ total }: { total: number }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/clip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          description: "Compra en Creyewear",
          orderId: `order_${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Clip payment link
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
