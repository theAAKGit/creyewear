"use client";

import { useState } from "react";
import Image from "next/image";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<null | { src: string; alt: string }>(null);

  const images = [
    { src: "/images/h1.jpg", alt: "Model wearing sunglasses" },
    { src: "/images/v1.jpg", alt: "Ski goggles fashion" },
    { src: "/images/v2.jpg", alt: "Classic round sunglasses" },
    { src: "/images/v3.jpg", alt: "Pink translucent glasses" },
    { src: "/images/5.png", alt: "Man wearing shades with cap" },
    { src: "/images/6.png", alt: "Black sunglasses product" },
    { src: "/images/7.png", alt: "Brown tortoiseshell sunglasses" },
  ];

  const handleOpen = (img: { src: string; alt: string }) => {
    setSelectedImage(img);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      {/* Gallery */}
      <div
        className="grid gap-4"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridTemplateRows: "repeat(4, auto)",
          gridTemplateAreas: `
            "img1 img1 img1 img2 img2 img2"
            "img1 img1 img1 img3 img5 img5"
            "img4 img4 img6 img6 img7 img7"
            ".    .    .    .    .    .   "
          `,
        }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            style={{ gridArea: `img${index + 1}` }}
            onClick={() => handleOpen(img)}
            className="cursor-pointer"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={800}
              height={1000}
              className="w-full h-full object-cover shadow"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
  <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
    {/* ✖ Close Button */}
    <button
      onClick={handleClose}
      className="absolute top-4 right-4 z-50 text-3xl font-bold text-black hover:scale-110 transition"
    >
      ✖
    </button>

    {/* Modal Content */}
    <div className="min-h-[100vh] flex flex-col md:flex-row justify-start items-stretch pt-20 md:pt-8 pb-16 px-6 md:px-16 gap-8">
      {/* Left Side - Text */}
      <div className="w-full md:w-1/2 flex flex-col justify-start items-start space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-black mb-4">Detalles</h2>
          <ul className="text-black text-lg space-y-2">
            <li><strong>Modelo:</strong> {selectedImage.alt.split(":")[0] || "Modelo Genérico"}</li>
            <li><strong>Colección:</strong> Primavera-Verano 2025</li>
            <li><strong>Material:</strong> Acetato Premium</li>
            <li><strong>Descripción:</strong> {selectedImage.alt}</li>
          </ul>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <Image
          src={selectedImage.src}
          alt={selectedImage.alt}
          width={450}  // ⬅️ control size here
          height={550}
          className="object-contain max-w-full"
          priority
        />
      </div>
    </div>
  </div>
)}

    </div>
  );
}
