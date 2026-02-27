'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');
      setIsLoggedIn(!!token);
      setRole(userRole);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
    router.push('/');
    router.refresh();
  };

  // Lógica de colores dinámica
  const isAdmin = isLoggedIn && role === 'admin';
  const navStyles = isAdmin 
    ? "bg-zinc-950 border-b border-blue-900/50 shadow-blue-900/20" // Estilo Admin (Oscuro)
    : "bg-white border-b border-gray-100 shadow-sm";              // Estilo Cliente (Claro)

  const textStyles = isAdmin ? "text-white" : "text-gray-900";
  const linkHover = isAdmin ? "hover:text-blue-400" : "hover:text-blue-600";

  return (
    <header className={`${navStyles} sticky top-0 z-50 transition-colors duration-500`}>
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO DINÁMICO */}
        <div className={`text-3xl font-black italic tracking-tighter uppercase ${textStyles}`}>
          <Link href="/">
            SWIFT<span className="text-blue-600">CUT</span>
          </Link>
          {isAdmin && <span className="ml-2 text-[10px] not-italic bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Staff</span>}
        </div>
        
        <ul className={`flex gap-8 items-center font-bold uppercase text-[11px] tracking-widest ${isAdmin ? 'text-zinc-400' : 'text-gray-500'}`}>
          <li>
            <Link href="/servicios" className={`${linkHover} transition-colors`}>Servicios</Link>
          </li>
          
          {/* BOTÓN AGENDAR / PANEL */}
          <li>
            {isAdmin ? (
              <Link 
                href="/admin/citas" 
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
              >
                Gestionar Agenda
              </Link>
            ) : (
              <Link 
                href="/agendar" 
                className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all"
              >
                Agendar Cita
              </Link>
            )}
          </li>

          <li>
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                {isAdmin ? 'Cerrar Panel' : 'Salir'}
              </button>
            ) : (
              <Link href="/login" className="hover:text-blue-600 transition-colors">Login</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}