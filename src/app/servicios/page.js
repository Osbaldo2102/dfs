'use client';

import { useState, useEffect, useCallback } from 'react';
import { API } from '@/config';
import StatusBox from '@/components/StatusBox';
import PrecioDolar from '@/components/PrecioDolar'; // Importamos el widget

export default function ServiciosBarberiaPage() {
  const [servicios, setServicios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const cargarServicios = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/productos?page=${pagina}&limit=5`);
      const data = await res.json();
      if (res.ok) {
        setServicios(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      setError('Error al conectar con la Barbería');
    } finally {
      setLoading(false);
    }
  }, [pagina]);

  useEffect(() => {
    cargarServicios();
  }, [cargarServicios]);

  const crearServicio = async (ev) => {
    ev.preventDefault();
    const token = localStorage.getItem('token');
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, precio: Number(precio) })
      });

      if (res.ok) {
        setSuccess('Servicio de barbería agregado con éxito');
        setNombre('');
        setPrecio('');
        cargarServicios();
      } else {
        const data = await res.json();
        setError(data.error || 'No se pudo crear el servicio');
      }
    } catch (err) {
      setError('Error de red');
    } 
  };

  return (
    <main className='flex flex-col gap-6 font-sans'>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Panel de Barbería</h1>
        <PrecioDolar />
      </div>

      {/* FORMULARIO DE NUEVO SERVICIO */}
      <section className="bg-zinc-900 text-white p-6 rounded-xl shadow-xl border-l-4 border-yellow-500">
        <h2 className="text-lg font-bold mb-4 uppercase">Registrar Nuevo Servicio</h2>
        <form onSubmit={crearServicio} className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
            <label className="text-xs text-gray-400 uppercase">Nombre del Servicio</label>
            <input
              className="bg-zinc-800 border-zinc-700 p-3 rounded text-white focus:outline-none focus:border-yellow-500"
              placeholder='Ej. Corte Fade + Barba'
              value={nombre}
              onChange={(e)=>setNombre(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-xs text-gray-400 uppercase">Precio ($)</label>
            <input
              className="bg-zinc-800 border-zinc-700 p-3 rounded text-white focus:outline-none focus:border-yellow-500"
              type="number"
              value={precio}
              onChange={(e)=>setPrecio(e.target.value)}
              required
            />
          </div>
          <button type="submit" className='bg-yellow-600 text-black font-bold px-8 py-3 rounded uppercase hover:bg-yellow-500 transition-all cursor-pointer'>
            Agregar
          </button>
        </form>
      </section>

      {/* LISTADO DE SERVICIOS */}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-black"></span>
          CATÁLOGO DE SERVICIOS
        </h2>
        
        <StatusBox loading={loading} error={error} success={success} />

        <div className="grid gap-4 mt-4">
          {servicios.map(s => (
            <div key={s.id} className="flex justify-between items-center p-4 border-b hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-bold text-lg uppercase tracking-tight">{s.nombre}</p>
                <span className="text-xs text-gray-500">Servicio Disponible</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-zinc-900">${s.precio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINACIÓN */}
        <div className="flex items-center justify-between mt-8 border-t pt-4">
          <button 
            disabled={pagina === 1 || loading}
            onClick={() => setPagina(p => p - 1)}
            className="text-sm font-bold uppercase hover:underline disabled:text-gray-300"
          >
            ← Anterior
          </button>
          <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">PÁG {pagina} / {totalPages}</span>
          <button 
            disabled={pagina === totalPages || loading}
            onClick={() => setPagina(p => p + 1)}
            className="text-sm font-bold uppercase hover:underline disabled:text-gray-300"
          >
            Siguiente →
          </button>
        </div>
      </section>
    </main>
  );
}