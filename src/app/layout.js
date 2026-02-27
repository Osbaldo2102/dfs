import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar.js"; // <-- Importamos el nuevo componente

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SwiftCut - Gestión Profesional",
  description: "Sistema de gestión de servicios y citas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen`}
      >
        {/* El Navbar inteligente que creamos arriba */}
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 py-8 flex-grow">
          {children}
        </main>

        <footer className="border-t bg-white mt-auto py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SwiftCut - Fase Final Backend & Frontend
        </footer>
      </body>
    </html>
  );
}