"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function CartDrawer() {
  const { cart, removeFromCart, isCartOpen, toggleCart } = useCart();

  return (
<div
  className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transition-transform transform ${
    isCartOpen ? "translate-x-0" : "translate-x-full"
  }`}
  style={{ zIndex: 9999 }} // ✅ Highest possible z-index
>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold text-black">Tu Carrito</h2>
        <button onClick={toggleCart} className="text-gray-600">&times;</button>
      </div>

      {/* Cart Items */}
      <div className="p-4 overflow-y-auto max-h-[70vh]">
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Tu carrito está vacío.</p>
        ) : (
          cart.map((product) => (
            <div key={product.id} className="flex items-center gap-4 border-b py-3">
              <img 
                src={product.images[0] || "/images/placeholder.png"} 
                alt={product.name} 
                width={50} 
                height={50} 
                className="rounded" 
              />
              <div className="flex-1">
                <h3 className="text-sm font-semibold">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-gray-500 text-xs">Cantidad: {product.quantity}</p>
              </div>
              <button
                className="text-red-500 text-sm"
                onClick={() => removeFromCart(product.id)}
              >
                Quitar
              </button>
            </div>
          ))
        )}
      </div>

      {/* Checkout Button */}
      {cart.length > 0 && (
        <div className="p-4">
          <Link href="/store/checkout" onClick={toggleCart}>
            <button className="w-full bg-[#84AAAF] text-white font-bold py-2 rounded hover:bg-[#4B6B70] transition">
              Ir a Pagar
            </button>
          </Link>

        </div>
      )}
    </div>
  );
}
