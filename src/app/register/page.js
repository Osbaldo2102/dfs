'use client';

import { useState } from 'react';
import { API } from '../../config'; 

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

  try{
    const response = await fetch(`${API}/users/register`, { 
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` <-- Solo si dejaste el requireRole('admin')
      },
      body: JSON.stringify({ email, password, role: 'user' })
    });

    const data = await response.json();

    if (response.ok) {
      alert("¡Usuario creado! Ahora intenta loguearte.");
    } else {
      alert("Error: " + data.error);
    }
  } catch (error) {
    console.error("Error al conectar con el servidor:", error);
    alert("No se pudo conectar con el servidor backend.");
  }
  };

  return (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <h2 style={{ color: 'white' }}>Crear Cuenta</h2>
        <input 
          type="email" 
          placeholder="Email" 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '8px', color: 'black' }}
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '8px', color: 'black' }}
        />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          Registrar
        </button>
      </form>
    </div>
  );
}
