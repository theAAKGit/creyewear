"use client";

import Image from "next/image";

export default function Gallery() {
  return (
    <div className="max-w-screen-xl mx-auto p-4">
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
        {/* 1 - Big close up left image */}
        <div style={{ gridArea: "img1" }}>
          <Image
            src="/images/1.png"
            alt="1"
            width={800}
            height={1000}
            className="w-full h-full object-cover shadow"
          />
        </div>

        {/* 2 - Tall ski goggles */}
        <div style={{ gridArea: "img2" }}>
          <Image
            src="/images/2.png"
            alt="2"
            width={800}
            height={1000}
            className="w-full h-full object-cover shadow"
          />
        </div>

        {/* 3 - Woman with round glasses */}
        <div style={{ gridArea: "img3" }}>
          <Image
            src="/images/3.png"
            alt="3"
            width={500}
            height={500}
            className="w-full h-full object-cover shadow"
          />
        </div>

        {/* 4 - Pink glasses */}
        <div style={{ gridArea: "img4" }}>
          <Image
            src="/images/4.png"
            alt="4"
            width={500}
            height={500}
            className="w-full h-full object-cover shadow"
          />
        </div>

        {/* 5 - Man with cap */}
        <div style={{ gridArea: "img5" }}>
          <Image
            src="/images/5.png"
            alt="5"
            width={500}
            height={500}
            className="w-full h-full object-cover shadow"
          />
        </div>

        {/* 6 - Black product sunglasses */}
        <div style={{ gridArea: "img6" }}>
          <Image
            src="/images/6.png"
            alt="6"
            width={500}
            height={500}
            className="w-full h-full object-cover  shadow"
          />
        </div>

        {/* 7 - Tortoiseshell product sunglasses */}
        <div style={{ gridArea: "img7" }}>
          <Image
            src="/images/7.png"
            alt="7"
            width={500}
            height={500}
            className="w-full h-full object-cover shadow"
          />
        </div>
      </div>
    </div>
  );
}
