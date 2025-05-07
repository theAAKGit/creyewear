"use client";

import { useState /*, useEffect*/ } from "react";
import Link from "next/link";
//import Image from "next/image";
import { useCart } from "../context/CartContext"; // Import Cart Context
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function Header() {
  //const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cart, toggleCart } = useCart();
/*
  useEffect(() => {
    setIsClient(true); // Ensures the component re-renders only on the client
  }, []);
*/
  

  return (
    <>
    <div
      className="text-black text-center py-3 text-lg font-medium w-full"
      style={{
        background: "url('/images/lilac-banner.png') no-repeat center/cover",
      }}
    >
      2x1 en todos los lentes de mujer
    </div>


      {/* Header */}
      <header className="bg-[#e4e4e4] text-black font-semibold tracking-wide h-32 flex items-center">
        <div className="container flex items-center justify-between py-4 relative">

          {/* Left Section: Logo + Navigation */}
          <div className="flex items-center space-x-6"> {/* Adjusted spacing */}
            {/* Logo (Image) */}
            <Link href="/" className="flex items-center no-underline">
              <img
                src="/images/icons/creyewearlogo.png"
                alt="Creyewear Logo"
                width={150}
                height={50}
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-4"> {/* Adjusted spacing */}
              <div
                className="relative group"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <Link href="/store" className="text-black hover:text-[#84AAAF] transition no-underline">Tienda</Link>
                {isDropdownOpen && (
                  <div className="absolute left-0 top-full bg-[#19333F] rounded shadow-md w-40 z-50">
                   
                  </div>
                )}
              </div>
              <Link href="/gallery" className="text-black hover:text-[#84AAAF] transition no-underline">Galería</Link>
              <Link href="/blog" className="text-black hover:text-[#84AAAF] transition no-underline">Blog</Link>
            </nav>
          </div>

          {/* Right Section: Cart Icon */}
          <div className="flex items-center space-x-4 md:space-x-6 ml-auto">
            <button className="relative flex items-center bg-[#19333F] p-2 rounded-full hover:bg-[#4B6B70]" onClick={toggleCart}>
              <ShoppingCartIcon className="w-6 h-6 text-white hover:text-[#84AAAF]" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Hamburger Menu for Mobile */}
            <button className="md:hidden text-white bg-[#19333F] p-2 rounded-md z-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
          </div>
        </div>
      </header>
      {isMenuOpen && (
  <div className="fixed inset-0 bg-[#d5c6e0] bg-opacity-95 text-white flex flex-col items-center justify-center z-[100]">
    <button className="absolute top-4 right-6 text-2xl" onClick={() => setIsMenuOpen(false)}>✖</button>
    <ul className="text-lg space-y-6">
      <li><Link href="/" className="text-[#4B6B70] hover:text-[#84AAAF] transition no-underline" onClick={() => setIsMenuOpen(false)}>Menu principal</Link></li>
      <li><Link href="/store" className="text-[#4B6B70] hover:text-[#84AAAF] transition no-underline" onClick={() => setIsMenuOpen(false)}>Tienda</Link></li>
      <li><Link href="/gallery" className="text-[#4B6B70] hover:text-[#84AAAF] transition no-underline" onClick={() => setIsMenuOpen(false)}>Galería</Link></li>
      <li><Link href="/blog" className="text-[#4B6B70] hover:text-[#84AAAF] transition no-underline" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
    </ul>
  </div>
)}

    </>
  );
}

