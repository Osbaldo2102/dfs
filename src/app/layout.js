import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CitasApp - Gestión Profesional",
  description: "Sistema de gestión de servicios y citas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <header className="bg-white border-b sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="font-bold text-xl text-blue-600">
              <Link href="/">CitasApp</Link>
            </div>
            
            <ul className="flex gap-6 items-center font-medium">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:text-blue-600 transition-colors">Servicios</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">Nosotros</Link>
              </li>
              <li>
                <Link 
                  href="/login" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="border-t bg-white mt-auto py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} CitasApp - Fase Final Backend & Frontend
        </footer>
      </body>
    </html>
  );
}