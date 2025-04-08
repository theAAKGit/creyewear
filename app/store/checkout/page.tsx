"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext"; // Import Cart Context
import ClipButton from "@/components/clipButton";
import PayPalButton from "@/components/paypalButton"; // PayPal Button Component

export default function Checkout() {
  const { cart } = useCart(); // 🛒 Get cart items from context
  const [deliveryMethod, setDeliveryMethod] = useState("home");

  // ✅ Ensure `subtotal` correctly calculates total price
  const subtotal = cart.reduce((total, product) => total + Number(product.price) * product.quantity, 0);

  return (
    <div className="bg-[white] text-white min-h-screen py-12">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 lg:px-12">
        
        {/* LEFT COLUMN: Checkout Form */}
        <div className="h-[80vh] overflow-y-auto p-4 bg-gray-800 rounded-md flex flex-col">
          
          {/* Delivery Details */}
          <h2 className="text-2xl font-bold mb-4">Datos de entrega</h2>
          <p className="mb-4 text-gray-300">¿Cómo te gustaría recibir tu pedido?</p>

          {/* Delivery Options */}
          <div className="space-y-4">
            <button
              onClick={() => setDeliveryMethod("home")}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-md border ${
                deliveryMethod === "home" ? "border-[#84AAAF] bg-[#4B6B70]" : "border-gray-500"
              }`}
            >
              <span className="flex items-center gap-2">📦 Entrega en domicilio</span>
              {deliveryMethod === "home" && <span className="text-green-400">✔</span>}
            </button>

            <button
              onClick={() => setDeliveryMethod("pickup")}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-md border ${
                deliveryMethod === "pickup" ? "border-[#84AAAF] bg-[#4B6B70]" : "border-gray-500"
              }`}
            >
              <span className="flex items-center gap-2">📍 Recoger en puntos de recolección</span>
              {deliveryMethod === "pickup" && <span className="text-green-400">✔</span>}
            </button>
          </div>

          {/* 📜 Name & Address */}
          <div className="mt-6">
            <h2 className="text-xl font-bold">Ingresa tu nombre y dirección:</h2>
            <input type="text" placeholder="Nombre" className="w-full border rounded p-2 mt-2 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#84AAAF]" />
            <input type="text" placeholder="Apellido" className="w-full border rounded p-2 mt-2 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#84AAAF]" />
            <input type="text" placeholder="Dirección" className="w-full border rounded p-2 mt-2 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#84AAAF]" />
          </div>

          {/* Contact Info */}
          <div className="mt-6">
            <h2 className="text-xl font-bold">Información de contacto</h2>
            <input type="email" placeholder="Correo electrónico" className="w-full border rounded p-2 mt-2 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#84AAAF]" />
            <input type="tel" placeholder="Número de teléfono" className="w-full border rounded p-2 mt-2 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#84AAAF]" />
          </div>

          {/* 💳 Payment Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Pago</h2>

            {/* Promo Code */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">¿Tienes un código promocional?</label>
              <input
                type="text"
                placeholder="Promoción"
                className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#84AAAF]"
              />
            </div>

            {/* ✅ Pass subtotal & cart items correctly to PayPal */}
            <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Pago</h2>

            {/* Clip Payment */}
            <h2 className="text-xl font-bold mt-6">Pago con Clip</h2>
            <ClipButton total={subtotal} />
          </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="bg-gray-800 p-6 rounded-md self-start sticky top-12">
          <h2 className="text-2xl font-bold mb-4">Resumen del pedido</h2>

          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Tu carrito está vacío.</p>
          ) : (
            <ul className="space-y-4">
              {cart.map((product) => (
                <li key={product.id} className="flex justify-between items-center p-4 border rounded-lg shadow">
                  <div className="flex items-center gap-4">
                    <Image src={product.images[0] || "/images/placeholder.png"} width={60} height={60} alt={product.name} className="rounded-md" />
                    <div>
                      <h3 className="text-white">{product.name}</h3>
                      <p className="text-gray-400 text-sm">Cantidad: {product.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold">${(Number(product.price) * product.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Subtotal & Total */}
          <div className="flex justify-between text-gray-300 mt-4">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-300 mt-2">
            <span>Entrega/Envío</span>
            <span className="text-green-400">Gratis</span>
          </div>
          <div className="w-full bg-green-400 h-1 my-2"></div>
          <p className="text-green-400 mb-4">¡Calificas para envío gratuito!</p>

          <div className="flex justify-between text-white font-bold text-lg">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {/* 📅 Estimated Delivery */}
          <div className="mt-4 bg-gray-900 p-4 rounded-md">
            <p className="text-gray-300">Llega el <strong className="text-white">mié 12 de feb</strong></p>
          </div>
        </div>

      </div>
    </div>
  );
}
