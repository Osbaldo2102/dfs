'use client';

import { useState } from 'react';

export default function NuevoProductoPage() { 
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [msg, setMsg] = useState('');

  const API = process.env.NEXT_PUBLIC_API_URL;


  const crear = async (ev) => {
    const token = localStorage.getItem('token');
    ev.preventDefault();

    try {
      const res = await fetch(`${API}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre,
          precio: Number(precio)
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data.error || 'Error al crear producto');
        return;
      }

      setMsg('Producto creado correctamente');
      setNombre('');
      setPrecio('');

    } catch (error) {
      console.error(error)
    } 
  }

  return (
    <main className='flex flex-col'>
      <h1>Nuevo Producto</h1>

      <form onSubmit={crear}>
        <div>
          <input
            placeholder='Nombre'
            value={nombre}
            onChange={(e)=>setNombre(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder='Precio'
            value={precio}
            onChange={(e)=>setPrecio(e.target.value)}
          />
        </div>
        <button type="submit" className='cursor-pointer border'>Crear</button>
      </form>
      {msg && <p>{ msg }</p>}
    </main>
  )
}