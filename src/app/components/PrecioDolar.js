'use client';
import { useEffect, useState } from 'react';
import { API } from '../../../config';

export default function PrecioDolar({ precioServicio = null }) {
  const [tasa, setTasa] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/externa/precio-dolar`)
      .then(res => res.json())
      .then(data => setTasa(data.precio))
      .catch(() => console.log("Error al cargar precio del dólar"));
  }, []);

  if (!tasa) return null;

  // Si pasamos un precio de servicio, calculamos la conversión
  if (precioServicio) {
    const conversion = (precioServicio / tasa).toFixed(2);
    return (
      <p className="text-zinc-400 text-xs font-bold uppercase tracking-tighter mt-1">
        Aprox. <span className="text-emerald-500 font-black">${conversion} USD</span>
      </p>
    );
  }

  // Si no hay precio de servicio, mostramos el cuadro de "Tipo de Cambio" general
  return (
    <div className="bg-white/80 backdrop-blur-sm px-5 py-2 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">Tipo de Cambio</span>
      <span className="text-xl font-black text-blue-600 italic">
        ${tasa} <span className="text-[10px] not-italic text-zinc-400">MXN</span>
      </span>
    </div>
  );
}