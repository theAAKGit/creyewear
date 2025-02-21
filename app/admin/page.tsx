"use client";

import { useState, useEffect } from "react";
import { products } from "../store/products"; // Adjust path if needed

interface Article {
  id: number;
  title: string;
  content: string;
  date: string;
}

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPrices, setShowPrices] = useState(false);
  const [showBlog, setShowBlog] = useState(false);

  // ✅ Price Management State
  const [productData, setProductData] = useState(
    products.map((product) => ({
      ...product,
      originalPrice: product.price,
      discount: "0",
      price: product.price,
    }))
  );

  // ✅ Blog Management State
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogPosts, setBlogPosts] = useState<Article[]>([]);

  const hardcodedPassword = "123";

  useEffect(() => {
    if (isAuthenticated && showPrices) {
      fetchPrices();
    }
  }, [isAuthenticated, showPrices]);

  useEffect(() => {
    if (isAuthenticated && showBlog) {
      fetchBlogPosts();
    }
  }, [isAuthenticated, showBlog]);

  const handleLogin = () => {
    if (password === hardcodedPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const handlePreciosClick = () => {
    setShowPrices(true);
    setShowBlog(false);
  };

  const handleBlogClick = () => {
    setShowBlog(true);
    setShowPrices(false);
  };

  // ✅ Fetch Prices
  const fetchPrices = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();

      if (data.products && Array.isArray(data.products)) {
        setProductData(
          products.map((product) => {
            const redisProduct = data.products.find((p: { id: number }) => p.id === product.id);
            return {
              ...product,
              originalPrice: redisProduct?.originalPrice ?? product.price,
              discount: redisProduct?.discount ?? "0",
              price: Math.max(
                (redisProduct?.originalPrice ?? product.price) -
                  (redisProduct?.discount.endsWith('%')
                    ? (parseFloat(redisProduct?.discount) / 100) * (redisProduct?.originalPrice ?? product.price)
                    : parseFloat(redisProduct?.discount ?? "0")),
                0
              ),
            };
          })
        );
      }
    } catch (error) {
      console.error("Failed to fetch product prices", error);
    }
  };

  // ✅ Handle Price Change
  const handlePriceChange = (id: number, field: "originalPrice" | "discount", value: string) => {
    setProductData((prevData) =>
      prevData.map((product) =>
        product.id === id
          ? {
              ...product,
              [field]: field === "originalPrice" ? parseFloat(value) || 0 : value,
              price: Math.max(
                (field === "originalPrice" ? parseFloat(value) || 0 : product.originalPrice) -
                  (value.endsWith('%')
                    ? ((field === "originalPrice" ? parseFloat(value) || 0 : product.originalPrice) * parseFloat(value.replace('%', '')) / 100)
                    : parseFloat(value.replace('%', '')) || 0),
                0
              ),
            }
          : product
      )
    );
  };

  // ✅ Save Prices
  const handleSaveChanges = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: productData }),
      });

      if (response.ok) {
        alert("Precios actualizados!");
      } else {
        alert("Error al actualizar los precios.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al guardar los cambios.");
    }
  };

  // ✅ Fetch Blog Posts
  const fetchBlogPosts = async () => {
    try {
      const response = await fetch("/api/blog");
      const data = await response.json();

      if (data.articles && Array.isArray(data.articles)) {
        setBlogPosts(data.articles);
      } else {
        setBlogPosts([]);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setBlogPosts([]);
    }
  };

  // ✅ Post Blog Article
  const handlePostBlog = async () => {
    if (!blogTitle || !blogContent) {
      alert("Please enter a title and content for the blog post.");
      return;
    }

    const newPost: Article = {
      id: Date.now(),
      title: blogTitle,
      content: blogContent,
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        alert("Blog post added!");
        setBlogTitle("");
        setBlogContent("");
        fetchBlogPosts();
      } else {
        alert("Error adding blog post.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was a problem posting the blog.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-96 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-600 rounded-md"
            placeholder="Enter password"
          />
          <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md">
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[white] text-[#19333F] p-6">
      <h1 className="text-black text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <button onClick={handlePreciosClick} className="bg-blue-600 text-white py-3 px-6 rounded-md">
          Precios
        </button>
        
        <button onClick={handleBlogClick} className="bg-blue-600 text-white py-3 px-6 rounded-md">
          Blog
        </button>
      </div>

      {showPrices && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Ajustar Precios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productData.map((product) => (
              <div key={product.id} className="p-4 bg-gray-800 text-white rounded-md">
                <h3 className="font-bold">{product.name}</h3>
                <input type="text" value={product.originalPrice.toFixed(2)} onChange={(e) => handlePriceChange(product.id, "originalPrice", e.target.value)} className="w-full p-2 mt-2"/>
                <input type="text" value={product.discount} onChange={(e) => handlePriceChange(product.id, "discount", e.target.value)} className="w-full p-2 mt-2"/>
              </div>
            ))}
          </div>
          <button onClick={handleSaveChanges} className="bg-green-600 text-white py-2 px-4 mt-4">
            Guardar Cambios
          </button>
        </div>
      )}

      {showBlog && (
        <div className="mt-6">
        <h2 className="text-xl font-bold">Publicar Artículo</h2>
        <input
          type="text"
          placeholder="Título del artículo"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          className="w-full p-2 mt-2 border border-gray-400 rounded-md"
        />
        <textarea
          placeholder="Contenido del artículo"
          value={blogContent}
          onChange={(e) => setBlogContent(e.target.value)}
          rows={5}
          className="w-full p-2 mt-2 border border-gray-400 rounded-md"
        />
        <button
          onClick={handlePostBlog}
          className="bg-green-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-green-700 transition"
        >
          Publicar
        </button>
      
        {/* ✅ Display Published Articles */}
        <h2 className="text-xl font-bold mt-6">Artículos Publicados</h2>
        {blogPosts.length === 0 ? (
          <p className="text-gray-500 mt-2">No hay artículos publicados aún.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {blogPosts.map((post) => (
              <li key={post.id} className="bg-gray-800 p-4 rounded-md shadow-md text-white">
                <h4 className="text-lg font-bold">{post.title}</h4>
                <p className="text-sm text-gray-400">
                  Publicado el{" "}
                  {new Date(post.date).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-300 mt-2">{post.content.slice(0, 100)}...</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      )}
    </div>
  );
};

export default AdminPage;
