'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '../../../config';
import { setToken } from '../lib/auth';
import StatusBox from '../components/StatusBox';

export default function LoginPage() { 
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const login = async (ev) => {
    ev.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/users/login`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Credenciales incorrectas');
        return;
      }

      setToken(data.token);
      localStorage.setItem('token', data.token); 
      window.dispatchEvent(new Event('storage'));
      setSuccess('¡Bienvenido! Redirigiendo...');
      
      setTimeout(() => {
        router.push('/servicios');
        router.refresh();
      }, 1500);

    } catch (err) {
      setError('Error al intentar iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor que centra la tarjeta en toda la pantalla
    <main className="min-h-[85vh] flex items-center justify-center p-6">  
      
      {/* Tarjeta Blanca Pro */}
      <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-gray-400/20 max-w-md w-full text-center border border-slate-50">
        
        <h1 className="text-4xl font-black mb-8 text-gray-900 uppercase italic tracking-tight">
          Iniciar Sesión
        </h1>
        
        <form onSubmit={login} className="flex flex-col gap-5 text-left">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 ml-4 uppercase">Email</label>
            <input 
              className="bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 transition-all"
              type="email"
              value={email} 
              placeholder="correo@ejemplo.com" 
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 ml-4 uppercase">Contraseña</label>
            <input 
              className="bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 transition-all"
              type="password"
              value={password} 
              placeholder="••••••••" 
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type='submit' 
            disabled={loading}
            className='bg-blue-600 text-white p-4 rounded-2xl font-black uppercase text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 disabled:bg-blue-300 mt-2'
          >
            {loading ? 'Cargando...' : 'Entrar'}
          </button>
        </form>
        
        <div className='mt-6 text-sm'>
          <StatusBox loading={loading} error={error} success={success} />
        </div>
      </div>
    </main>
  );
}