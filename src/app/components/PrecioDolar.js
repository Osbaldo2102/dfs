'use client';
import { useEffect, useState } from 'react';
import { API } from '../../../config';

export default function PrecioDolar() {
  const [precio, setPrecio] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/externa/precio-dolar`)
      .then(res => res.json())
      .then(data => setPrecio(data.precio))
      .catch(() => console.log("Error al cargar precio del dólar"));
  }, []);

  if (!precio) return null;

  return (
    <div className="bg-black text-gold-500 p-3 rounded-lg border border-yellow-600 flex flex-col items-center">
      <span className="text-xs uppercase tracking-widest text-gray-400">Tipo de Cambio</span>
      <span className="text-lg font-bold text-yellow-500">${precio} MXN</span>
    </div>
  );
}