'use client';
import { useState, useEffect } from 'react';
import { API } from '../../../../../config'; 
import StatusBox from '../../../components/StatusBox';

export default function AdminCitasPage() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // ESTADOS PARA PAGINACIÓN
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Citas por página

  const cargarCitas = async (paginaActual = 1) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // Enviamos page y limit como query params
      const res = await fetch(`${API}/citas?page=${paginaActual}&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const response = await res.json();
      
      if (res.ok) {
        // Importante: Ahora los datos vienen en response.data
        setCitas(response.data || []);
        setTotalPages(response.totalPages || 1);
        setPage(response.currentPage || paginaActual);
      } else {
        setError('No tienes permisos de administrador');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Recargar citas cuando cambie la página
  useEffect(() => { 
    cargarCitas(page); 
  }, [page]);

  const actualizarEstado = async (id, nuevoEstado) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/citas/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (res.ok) cargarCitas(page); 
    } catch (err) { alert('Error al actualizar'); }
  };

  return (
    <main className="max-w-6xl mx-auto p-6 min-h-screen text-zinc-900">
      <header className="mb-12 border-b border-zinc-100 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            Panel de <span className="text-blue-600">Control</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest mt-2">Gestión de Citas SwiftCut</p>
        </div>
        
        {/* INDICADOR DE PÁGINA SUPERIOR */}
        <div className="text-[10px] font-black uppercase text-zinc-400 tracking-tighter">
            Página <span className="text-blue-600">{page}</span> de {totalPages}
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5 border border-zinc-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 text-zinc-400 text-[10px] uppercase font-black tracking-widest">
              <th className="p-8">Cliente</th>
              <th className="p-8">Servicio</th>
              <th className="p-8">Horario</th>
              <th className="p-8">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map(cita => (
              <tr key={cita.id} className="border-b border-zinc-50 hover:bg-blue-50/30 transition-all">
                <td className="p-8">
                  <p className="font-black text-zinc-800 uppercase leading-none mb-1">{cita.cliente_nombre}</p>
                  <p className="text-xs text-blue-600 font-bold">{cita.cliente_telefono}</p>
                </td>
                <td className="p-8">
                  <span className="bg-zinc-100 text-zinc-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {cita.servicio_nombre || `Producto ID: ${cita.servicio_id}`}
                  </span>
                </td>
                <td className="p-8">
                  <p className="text-sm font-bold text-zinc-700">{new Date(cita.fecha).toLocaleDateString()}</p>
                  <p className="text-xs text-zinc-400 font-bold uppercase">{cita.hora}</p>
                </td>
                <td className="p-8">
                  <div className="flex gap-2">
                    {cita.estado === 'pendiente' && (
                      <button 
                        onClick={() => actualizarEstado(cita.id, 'confirmada')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
                      >
                        Confirmar
                      </button>
                    )}
                    <button 
                      className="bg-zinc-100 hover:bg-red-50 text-zinc-400 hover:text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      X
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* CONTROLES DE PAGINACIÓN */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-center items-center gap-6">
            <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="bg-white border border-zinc-200 text-zinc-600 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-zinc-600"
            >
                Anterior
            </button>
            
            <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`w-8 h-8 rounded-full text-[10px] font-black transition-all ${page === i + 1 ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-white text-zinc-400 hover:bg-zinc-200'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="bg-white border border-zinc-200 text-zinc-600 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-zinc-600"
            >
                Siguiente
            </button>
        </div>

        {citas.length === 0 && !loading && (
          <div className="p-20 text-center">
            <p className="text-zinc-300 font-black text-2xl uppercase italic">No hay citas pendientes</p>
          </div>
        )}
      </div>
      <StatusBox loading={loading} error={error} />
    </main>
  );
}