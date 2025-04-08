"use client";

export default function DefaultPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded shadow-md">
        <h1 className="text-3xl font-bold text-gray-600">Redirección Predeterminada</h1>
        <p className="text-gray-700 mt-4">Esta es la página de redirección predeterminada.</p>
        <a href="/store" className="mt-6 inline-block px-4 py-2 bg-gray-500 text-white rounded">
          Volver a la tienda
        </a>
      </div>
    </div>
  );
}
