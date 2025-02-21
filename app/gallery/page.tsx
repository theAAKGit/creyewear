"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";

export default function Gallery() {
  const images = [
    { src: "/images/gallery1.jpg", alt: "Model wearing sunglasses" },
    { src: "/images/gallery2.jpg", alt: "Ski goggles fashion" },
    { src: "/images/gallery3.jpg", alt: "Classic round sunglasses" },
    { src: "/images/gallery4.jpg", alt: "Pink translucent glasses" },
    { src: "/images/gallery5.jpg", alt: "Man wearing shades with cap" },
    { src: "/images/gallery6.jpg", alt: "Black sunglasses product" },
    { src: "/images/gallery7.jpg", alt: "Brown tortoiseshell sunglasses" },
  ];

  // Shuffle images on page load
  const [shuffledImages, setShuffledImages] = useState(images);

  useEffect(() => {
    setShuffledImages([...images].sort(() => Math.random() - 0.5));
  }, []);

  // Masonry breakpoints
  const breakpointColumns = {
    default: 3,
    1024: 3,
    768: 2,
    480: 1,
  };

  return (
    <main className="container mx-auto p-4">
      {/* Masonry Grid */}
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-column"
      >
        {shuffledImages.map((img, index) => (
          <motion.div
            key={index}
            className="masonry-item relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={500}
              height={500}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </motion.div>
        ))}
      </Masonry>

    </main>
  );
}
