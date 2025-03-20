"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true, // ✅ Render HTML tags in markdown
  breaks: true, // ✅ Convert line breaks to <br>
});

interface Product {
  category: string;
  id: number;
  name: string;
  description: string;
  image: string; // ✅ Ensure image is always a string
  originalPrice: number;
  discount: string;
  price: number;
  sizes?: string[]; // ✅ Ensure sizes are included
}

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string; // ✅ Optional selected size
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    if (!id) return;
  
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        
        if (!data.error) {
          setProduct({
            ...data,
            category: data.category || "uncategorized", 
            image: data.image ?? "/images/placeholder.png",
            sizes: Array.isArray(data.sizes) ? data.sizes : [], // ✅ Ensure sizes are always an array
            price: Math.max(
              data.originalPrice -
                (data.discount.endsWith('%') 
                  ? (data.originalPrice * parseFloat(data.discount) / 100) 
                  : parseFloat(data.discount)
                ), 
              0
            ),
          });       
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchProduct();
  }, [id]);
  

  const handleAddToCart = () => {
    if (!product) return;
  
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Por favor, selecciona un tamaño antes de añadir al carrito.");
      return;
    }
  
    const cartItem: CartItem = {
      ...product,
      image: product.image || "/images/placeholder.png", // ✅ Ensure image is always a string
      quantity,
      selectedSize: product.sizes && product.sizes.length > 0 ? selectedSize : undefined, // ✅ Only include if product has sizes
    };
  
    addToCart(cartItem);
  };  
    
  if (loading) {
    return <p className="text-center text-gray-500">Cargando producto...</p>;
  }

  if (!product) {
    return <p className="text-center text-gray-500">Producto no encontrado</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Product Image */}
        <img
          src={product.image || "/images/placeholder.png"}
          alt={product.name}
          className="w-96 h-96 object-contain"
        />

        {/* Product Details */}
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold text-black">{product.name}</h1>
          <div
            className="prose prose-lg text-gray-700 mt-4"
            dangerouslySetInnerHTML={{ __html: md.render(product.description || "") }}
          />
          
          {/* Price Section */}
          <div className="mt-4">
            {product.discount !== "0" && (
              <p className="text-gray-500 line-through text-xl">
                ${product.originalPrice.toFixed(2)}
              </p>
            )}
            <p className="text-3xl font-semibold text-primary">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-4">
              <label className="text-black text-lg font-medium">Tamaño:</label>
              <select
                className="text-black w-full p-2 border rounded-lg mt-2"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Selecciona un tamaño</option>
                {product.sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mt-4 flex items-center gap-4">
            <label className="text-black text-lg font-medium">Cantidad:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-black w-16 text-center p-2 border rounded-lg"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart} // ✅ Use cart function directly
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
