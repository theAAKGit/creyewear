import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "@/components/cartDrawer";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"], // Light, Regular, Bold, Black
  variable: "--font-poppins",
});



export const metadata: Metadata = {
  title: "Creyewear",
  description: "Nada es lo que parece",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
  <html lang="en">
    
  {/* Google Analytics */}
  <Script
    src="https://www.googletagmanager.com/gtag/js?id=G-CETR3K6EF5"
    strategy="afterInteractive"
  />
  <Script id="gtag-init" strategy="afterInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-CETR3K6EF5');
    `}
  </Script>
      <body
      className={`${poppins.variable} antialiased text-foreground bg-background flex flex-col min-h-screen font-poppins`}
      >
        <CartProvider>
        <CartDrawer />
        {/* Header for Navigation */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow container mx-auto p-4 md:p-8">
          {children}
        </main>

        {/* Footer at the bottom */}
        <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
