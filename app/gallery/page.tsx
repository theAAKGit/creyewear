"use client";

import { useState } from "react";
import Image from "next/image";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<null | {
    src: string;
    alt: string;
    material: string;
    polarizado: boolean;
  }>(null);
  

  const images = [
    { src: "/images/gallery/test.png", alt: "1814", material: "Acetato", polarizado: true },
    { src: "/images/gallery/v1.jpg", alt: "Cactus", material: "Acetato", polarizado: true },
    { src: "/images/gallery/v2.jpg", alt: "Bye", material: "Acero Inoxidable", polarizado: true },
    { src: "/images/gallery/v3.jpg", alt: "Bye", material: "Acero Inoxidable", polarizado: true },
    { src: "/images/gallery/2.jpg", alt: "Man wearing shades with cap", material: "Madera", polarizado: true },
    { src: "/images/gallery/3.jpg", alt: "Black sunglasses product", material: "Acetato", polarizado: true },
    { src: "/images/gallery/4.jpg", alt: "Brown tortoiseshell sunglasses", material: "Metal", polarizado: true },
  ];
  

  const handleOpen = (img: typeof images[0]) => {
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
        {/* Decorative stacked squares for img1 */}
<div
  style={{ gridArea: "img1" }}
  className="flex flex-col w-full h-full"
>
  <div className="bg-[#e4e4e4] flex-1 w-full" />
  <div className="bg-[#d5c6e0] flex-1 w-full" />
  <div className="bg-[#d5c6e0] flex-1 w-full" />
</div>

{/* Rest of the images */}
{images.slice(1).map((img, index) => (
  <div
    key={index + 1}
    style={{ gridArea: `img${index + 2}` }}
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
            <li><strong>Modelo:</strong> {selectedImage.alt || "Modelo Genérico"}</li>
            <li><strong>Material:</strong> {selectedImage.material}</li>
            
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
