"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (orderId) {
      console.log("🟢 SuccessPage loaded with orderId:", orderId);

      fetch(`/api/send-mail?orderId=${orderId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Email failed");
          console.log("✅ Email successfully triggered from success page");
        })
        .catch((err) => {
          console.error("❌ Email send failed from success page:", err);
        });
    } else {
      console.warn("⚠️ No orderId found in URL");
    }
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="text-center p-8 bg-white rounded shadow-md">
        <h1 className="text-3xl font-bold text-green-600">¡Pago Exitoso!</h1>
        <p className="text-gray-700 mt-4">Tu pago ha sido procesado correctamente.</p>
        <Link href="/store/">Volver a la tienda</Link>
      </div>
    </div>
  );
}
