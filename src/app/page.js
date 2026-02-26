import { getProductos } from './utils/api/getProductos';
import Link from 'next/link';

export default async function BarberiaPrincipalPage() {
  // Obtenemos los servicios (que en la base de datos se llaman productos)
  const servicios = await getProductos() || [];

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black uppercase italic mb-6">Nuestros Servicios</h1>

      {servicios.length === 0 ? (
        <p className="text-gray-500 italic">Por el momento no hay servicios registrados.</p>
      ) : (
        <p className="mb-4 font-medium text-zinc-600">
          Mostrando {servicios.length} especialidades de la casa
        </p>
      )}

      <div className="grid gap-4">
        {Array.isArray(servicios) && servicios.map((servicio) => (
          <div 
            key={servicio.id} 
            className="flex justify-between items-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
          >
            <div>
              <h2 className="font-bold text-lg uppercase">{servicio.nombre}</h2>
              <span className="text-xl font-black text-yellow-600">${servicio.precio}</span>
            </div>
            
            <Link 
              href={`/servicios/${servicio.id}`} 
              className="bg-black text-white px-4 py-2 rounded text-sm font-bold uppercase hover:bg-zinc-800"
            >
              Detalles
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}