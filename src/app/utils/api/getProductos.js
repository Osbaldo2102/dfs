export const getProductos = async () => {
  const API = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${API}/productos`, { cache: 'no-store' });
    const data = await res.json();
  
    return data.data || []; 
  } catch (error) {
    console.error(error);
    return [];
  }
};