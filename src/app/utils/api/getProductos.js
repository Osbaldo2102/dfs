// import { API } from '@/config';

export async function getProductos() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API}/productos`);
  if (!res.ok) {
    throw new Error('Error al cargar productos');
  }

  return res.json();
}