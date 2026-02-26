'use client';
import { useEffect, useState } from 'react';

export default function PrivadoPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token'); // ⚡ solo en navegador
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/privado`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('No autorizado o error en la petición');
        }

        const result = await res.json();
        setData(result);
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (!data) return <p>Cargando...</p>;

  return (
    <main className="p-4">
      <h1>Ruta privada</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}

            
