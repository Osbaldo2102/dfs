'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [mounted, setMounted] = useState(false); // Evita errores de renderizado
  const router = useRouter();

  useEffect(() => {
    setMounted(true); // El componente ya está en el cliente
    
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');
      // Verificación estricta del token
      setIsLoggedIn(!!(token && token !== "undefined" && token !== "null"));
      setRole(userRole);
    };

    checkAuth();
    // Escucha cambios en otras pestañas
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

  // Si no ha montado en el cliente, no renderizamos nada para evitar el botón fantasma
  if (!mounted) return null;

  const isAdmin = isLoggedIn && role === 'admin';
  const navStyles = isAdmin 
    ? "bg-zinc-950 border-b border-blue-900/50 shadow-blue-900/20" 
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
            <span className="ml-2 text-[10px] not-italic bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">
              Staff
            </span>
          )}
        </div>
        
        <ul className={`flex gap-8 items-center font-bold uppercase text-[11px] tracking-widest ${isAdmin ? 'text-zinc-400' : 'text-gray-500'}`}>
          <li>
            <Link href="/servicios" className={`${linkHover} transition-colors`}>Servicios</Link>
          </li>
          
          {/* LÓGICA DE BOTÓN DINÁMICO */}
          <li>
            {isLoggedIn ? (
              // CASO: USUARIO LOGUEADO
              isAdmin ? (
                <Link 
                  href="/admin/citas" 
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
                >
                  Gestionar Agenda
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
              // CASO: INVITADO (No mostramos el botón de Agendar)
              <Link href="/login" className="text-blue-600 hover:text-blue-800 transition-colors">
                Reservar Turno
              </Link>
            )}
          </li>

          <li>
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-400 font-black transition-colors"
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