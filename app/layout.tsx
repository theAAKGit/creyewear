import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "@/components/cartDrawer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"], // Light, Regular, Bold, Black
  variable: "--font-poppins",
});



export const metadata: Metadata = {
  title: "Creyewear",
  description: "Be unique, be creyewear",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
