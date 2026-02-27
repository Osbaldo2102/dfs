'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link'; 
import { API } from '../../../config'; 

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(`${API}/users/register`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'user' })
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Usuario creado! Redirigiendo al login...");
        router.push('/login');
      } else {
        alert("Error: " + (data.error || "Algo salió mal"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor que centra la tarjeta (Igual al Login)
    <main className="min-h-[85vh] flex items-center justify-center p-6">
      
      {/* La Tarjeta Blanca Estilo Moderno */}
      <section className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-gray-400/20 max-w-md w-full text-center border border-slate-50">
        
        <header className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tight mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
            Únete a la comunidad de App
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 ml-4 uppercase" htmlFor="email">
              Correo electrónico
            </label>
            <input 
              id="email"
              className="bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 transition-all"
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 ml-4 uppercase" htmlFor="password">
              Contraseña
            </label>
            <input 
              id="password"
              className="bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 transition-all"
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="bg-blue-600 text-white p-4 rounded-2xl font-black uppercase text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 mt-2 disabled:bg-blue-300"
          >
            {loading ? 'Procesando...' : 'Registrar'}
          </button>
        </form>

        <footer className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-gray-500 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </footer>
      </section>
    </main>
  );
}