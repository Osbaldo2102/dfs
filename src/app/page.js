import { getProductos } from '../utils/api/getProductos';
import Link from 'next/link';

export default async function ProductosPage() {

  const productos = await getProductos();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Productos</h1>

      {productos.length === 0 && <p>No hay productos</p>}

      Total de productos: {productos.length}

      <ul className="list-disc">
        {productos.map((producto) => (
          <li key={producto.id} className=" mt-3">
            {producto.nombre} - 
            <span className="text-sm text-gray-400"> ${producto.precio}</span>
            <Link href={`/productos/${producto.id}`}>Ver detalles</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}