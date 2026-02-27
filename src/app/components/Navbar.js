'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [mounted, setMounted] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    setMounted(true); 
    
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');
      setIsLoggedIn(!!(token && token !== "undefined" && token !== "null"));
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

  if (!mounted) return null;

  const isAdmin = isLoggedIn && role === 'admin';
  const navStyles = isAdmin 
    ? "bg-zinc-950 border-b border-blue-900/50 shadow-2xl shadow-blue-900/10" 
    : "bg-white border-b border-gray-100 shadow-sm";

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
          {isAdmin && (
            <span className="ml-2 text-[9px] align-middle not-italic bg-blue-600 text-white px-2 py-0.5 rounded-md uppercase tracking-widest font-black">
              Admin Mode
            </span>
          )}
        </div>
        
        <ul className={`flex gap-8 items-center font-bold uppercase text-[11px] tracking-widest ${isAdmin ? 'text-zinc-400' : 'text-gray-500'}`}>
          
          {/* SERVICIOS / GESTIÓN: Ahora visible para todos */}
          <li>
            <Link href="/servicios" className={`${linkHover} transition-colors uppercase`}>
              {isAdmin ? 'Gestionar Servicios' : 'Servicios'}
            </Link>
          </li>
          
          {/* BOTÓN PRINCIPAL DE ACCIÓN */}
          <li>
            {isLoggedIn ? (
              isAdmin ? (
                // BOTÓN SIEMPRE VISIBLE PARA EL ADMIN
                <Link 
                  href="/admin/citas" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40 border border-blue-400/20 flex items-center gap-2"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-100"></span>
                  </span>
                  Panel de Citas
                </Link>
              ) : (
                <Link 
                  href="/agendar" 
                  className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-lg"
                >
                  Agendar Cita
                </Link>
              )
            ) : (
              <Link href="/login" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all">
                Reservar Turno
              </Link>
            )}
          </li>

          {/* BOTÓN DE SALIDA */}
          <li>
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className={`${isAdmin ? 'text-zinc-500 hover:text-white' : 'text-red-500 hover:text-red-600'} font-black transition-colors flex items-center gap-1`}
              >
                {isAdmin ? 'Cerrar Sesión' : 'Salir'}
              </button>
            ) : (
              <Link href="/login" className={`${linkHover} transition-colors`}>Login</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}