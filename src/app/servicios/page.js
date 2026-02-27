'use client';

import { useState, useEffect, useCallback } from 'react';
import { API } from '../../../config';
import StatusBox from '../components/StatusBox';
import PrecioDolar from '../components/PrecioDolar';

export default function ServiciosBarberiaPage() {
  const [servicios, setServicios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    const rol = localStorage.getItem('role');
    setEsAdmin(rol === 'admin');
  }, []);

  const cargarServicios = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const limite = esAdmin ? 10 : 9;
      const res = await fetch(`${API}/productos?page=${pagina}&limit=${limite}`);
      const json = await res.json();
      
      if (res.ok) {
        setServicios(json.data || []); 
        setTotalPages(json.pagination?.totalPages || 1);
      } else {
        setError(json.error || 'Error al cargar servicios');
      }
    } catch (err) {
      setError('Error al conectar con el servidor de SwiftCut');
    } finally {
      setLoading(false);
    }
  }, [pagina, esAdmin]);

  useEffect(() => { cargarServicios(); }, [cargarServicios]);

  const crearServicio = async (ev) => {
    ev.preventDefault();
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await fetch(`${API}/productos`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ nombre, precio: Number(precio) })
      });
      
      const resData = await res.json();

      if (res.ok) {
        setSuccess('¡Servicio SwiftCut agregado con éxito!');
        setNombre(''); setPrecio('');
        cargarServicios();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(resData.error || 'No se pudo crear el servicio');
      }
    } catch (err) { 
      setError('Error de red al intentar crear'); 
    } finally {
      setLoading(false);
    }
  };

  return (
   <main className="max-w-6xl mx-auto p-6 font-sans">
    <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
      <h1 className="text-5xl font-black uppercase italic tracking-tighter text-gray-900">
        {esAdmin ? <span className="text-zinc-800">Panel <span className="text-blue-600">Admin</span></span> : 'Nuestros Servicios'}
      </h1>
      {/* Tasa general en el Header */}
      <PrecioDolar />
    </header>

    {esAdmin && (
      <section className="bg-zinc-900 p-8 md:p-12 rounded-[3rem] shadow-2xl border-l-[12px] border-blue-600 mb-12 text-white transition-all hover:shadow-blue-500/10">
        <h2 className="text-xl font-bold mb-8 uppercase tracking-widest text-blue-400">Registrar Nuevo Servicio</h2>
        <form onSubmit={crearServicio} className="flex flex-wrap gap-6 items-end text-left">
          <div className="flex flex-col gap-2 flex-1 min-w-[280px]">
            <label className="text-xs text-zinc-500 font-bold uppercase ml-2">Nombre del Servicio</label>
            <input 
              className="bg-zinc-800 p-5 rounded-2xl text-white border border-zinc-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-zinc-600"
              placeholder="Ej. Corte Desvanecido (Fade)"
              value={nombre} onChange={(e)=>setNombre(e.target.value)} required 
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-48">
            <label className="text-xs text-zinc-500 font-bold uppercase ml-2">Precio ($)</label>
            <input 
              className="bg-zinc-800 p-5 rounded-2xl text-white border border-zinc-700 font-black text-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              type="number" value={precio} onChange={(e)=>setPrecio(e.target.value)} required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-wide shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Agregando...' : 'Agregar'}
          </button>
        </form>
      </section>
    )}

    <div className="mb-8">
        <StatusBox loading={loading} error={error} success={success} />
    </div>

    <section className={esAdmin ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"}>
      {servicios.length > 0 ? (
        servicios.map(s => (
          esAdmin ? (
            <article key={s.id} className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 flex justify-between items-center transition-all hover:shadow-xl">
              <div>
                <p className="font-black text-xl uppercase text-zinc-800 tracking-tight">{s.nombre}</p>
                {/* Conversión pequeña para el admin también */}
                <PrecioDolar precioServicio={s.precio} />
              </div>
              <p className="text-3xl font-black text-blue-600 italic">${s.precio}</p>
            </article>
          ) : (
            <article key={s.id} className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-slate-50 flex flex-col items-center text-center transition-transform hover:scale-[1.03]">
              <span className="text-6xl mb-6">💈</span>
              <h2 className="text-2xl font-black uppercase text-gray-800 mb-2 leading-tight h-16 flex items-center justify-center">{s.nombre}</h2>
              
              {/* BLOQUE DE PRECIO ACTUALIZADO */}
              <div className="my-6">
                <p className="text-4xl font-black text-blue-600">${s.precio}</p>
                {/* Aquí inyectamos la conversión dinámica */}
                <PrecioDolar precioServicio={s.precio} />
              </div>

              <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                Reservar Cita
              </button>
            </article>
          )
        ))
      ) : (
        !loading && <p className="col-span-full text-center text-zinc-500 font-bold uppercase tracking-widest">No hay servicios disponibles</p>
      )}
    </section>

    {totalPages > 1 && (
      <div className="flex justify-center gap-4 mt-12">
        <button 
          onClick={() => setPagina(p => Math.max(1, p - 1))}
          className="bg-white px-6 py-3 rounded-xl shadow-sm font-bold disabled:opacity-30"
          disabled={pagina === 1}
        > Anterior </button>
        <span className="flex items-center font-black">Página {pagina} de {totalPages}</span>
        <button 
          onClick={() => setPagina(p => Math.min(totalPages, p + 1))}
          className="bg-white px-6 py-3 rounded-xl shadow-sm font-bold disabled:opacity-30"
          disabled={pagina === totalPages}
        > Siguiente </button>
      </div>
    )}
  </main>
);
}