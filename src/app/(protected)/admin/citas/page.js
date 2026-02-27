'use client';
import { useState, useEffect } from 'react';
import { API } from '../../../config'; // Ajusta la ruta según tu profundidad de carpetas
import StatusBox from '../../components/StatusBox';

export default function AdminCitasPage() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarCitas = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/citas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setCitas(data);
      else setError('No tienes permisos de administrador');
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarCitas(); }, []);

  // Función para cambiar el estado (Confirmar)
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
      if (res.ok) cargarCitas(); // Recargamos la lista
    } catch (err) { alert('Error al actualizar'); }
  };

  return (
    <main className="max-w-6xl mx-auto p-6 min-h-screen text-zinc-900">
      <header className="mb-12 border-b border-zinc-100 pb-6">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">
          Panel de <span className="text-blue-600">Control</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest mt-2">Gestión de Citas SwiftCut</p>
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
                    {cita.servicio_nombre}
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