'use client';
import { useState } from 'react';

export default function LoginPage() { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const API = process.env.NEXT_PUBLIC_API_URL;

  const login = async (ev) => {
    ev.preventDefault();

    const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

    const data = await res.json();

    if (!res.ok) {
        setMsg(data.error || 'Error');
        return;
    }

    localStorage.setItem('token', data.token);
    setMsg('Login exitoso');
    setEmail('');
    setPassword('');
  }





  return (
    <main className='p-4'>  
      <h1>Login</h1>
      
      <form onSubmit={login}>
        <input value={email} placeholder="Email" onChange={e => setEmail(e.target.value)}/>
        <input value={password} placeholder="Password" onChange={e => setPassword(e.target.value)}/>
        <button type='submit' className='border cursor-pointer'>Login</button>
        </form>
        {msg && <p>{msg}</p>}
        </main>
    );
}