import { useState } from 'react';
import { API } from '../config'; 

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

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
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Cuenta</h2>
      <input 
        type="email" 
        placeholder="Email" 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="Contraseña" 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      <button type="submit">Registrar</button>
    </form>
  );
};