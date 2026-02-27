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
      // Ajuste de ruta: agregamos /users antes de /login
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

      // Guardamos el token en las cookies/localStorage
      setToken(data.token);
      setSuccess('¡Bienvenido! Redirigiendo...');
      
      // Redirigir al usuario después de un login exitoso
      setTimeout(() => {
        router.push('/servicios'); 
      }, 1500);

    } catch (err) {
      setError('Error al intentar iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='p-4 max-w-md mx-auto'>  
      <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
      
      <form onSubmit={login} className="flex flex-col gap-3">
        <input 
          className="border p-2 rounded"
          type="email"
          value={email} 
          placeholder="Email" 
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input 
          className="border p-2 rounded"
          type="password"
          value={password} 
          placeholder="Contraseña" 
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button 
          type='submit' 
          disabled={loading}
          className='bg-blue-600 text-white p-2 rounded cursor-pointer disabled:bg-blue-300'
        >
          {loading ? 'Cargando...' : 'Entrar'}
        </button>
      </form>
      
      <div className='mt-3'>
        <StatusBox loading={loading} error={error} success={success} />
      </div>
    </main>
  );
}