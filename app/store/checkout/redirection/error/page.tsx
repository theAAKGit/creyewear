"use client";

import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="text-center p-8 bg-white rounded shadow-md">
        <h1 className="text-3xl font-bold text-red-600">¡Error en el Pago!</h1>
        <p className="text-gray-700 mt-4">Hubo un problema al procesar tu pago. Intenta nuevamente.</p>
        <Link href="/store/">Volver a la pagina de pago</Link>
      </div>
    </div>
  );
}
