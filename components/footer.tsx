"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Render nothing until hydration is complete.

  return (
    <footer className="bg-[#d5c6e0] text-black py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left px-6">
        
        {/* Left Column - Collections */}
        <div className="w-1/3 flex flex-col items-center md:items-start">
          <h3 className="text-black font-bold mb-2">Contact</h3>
          <ul className="text-sm space-y-1">
            <li>Placeholder cellphone</li>
            <li>Placeholder email</li>
          </ul>
        </div>

        {/* Center Column - Collaborations with Divider */}
        <div className="w-1/3 flex flex-col items-center relative">
          
          <h3 className="text-black font-bold mb-2">Collections</h3>
          <ul className="text-sm space-y-1">
            <li>Collection 1</li>
            <li>Collection 2</li>
          </ul>
        </div>

        {/* Right Column - Reviews with Divider */}
        <div className="w-1/3 flex flex-col items-center md:items-end">
          
          <h3 className="text-black font-bold mb-2">Admin</h3>
          <ul className="text-sm space-y-1">
            <li>
              <Link
                href="/admin"
                
              >
                Admin
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </footer>
  );
}
