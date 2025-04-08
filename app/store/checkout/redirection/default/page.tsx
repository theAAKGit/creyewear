"use client";

import Link from "next/link";

export default function DefaultPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded shadow-md">
        <h1 className="text-3xl font-bold text-gray-600">Redirección Predeterminada</h1>
        <p className="text-gray-700 mt-4">Esta es la página de redirección predeterminada.</p>
        <Link href="/store/">Volver a la tienda</Link>

      </div>
    </div>
  );
}
