import type { Metadata } from "next";
import { Anonymous_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "@/components/cartDrawer";



const anonymousPro = Anonymous_Pro({
  variable: "--font-anonymous-pro",
  subsets: ["latin"],
  weight: ["400", "700"], // Regular & Bold
});


export const metadata: Metadata = {
  title: "creyewear",
  description: "Best eyewear",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${anonymousPro.variable} antialiased text-foreground bg-background flex flex-col min-h-screen`}>

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
