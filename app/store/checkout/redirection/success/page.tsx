"use client";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="text-center p-8 bg-white rounded shadow-md">
        <h1 className="text-3xl font-bold text-green-600">¡Pago Exitoso!</h1>
        <p className="text-gray-700 mt-4">Tu pago ha sido procesado correctamente.</p>
        <a href="/store" className="mt-6 inline-block px-4 py-2 bg-green-500 text-white rounded">
          Volver a la tienda
        </a>
      </div>
    </div>
  );
}
