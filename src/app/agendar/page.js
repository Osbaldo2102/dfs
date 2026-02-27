'use client';
import { useState, useEffect } from 'react';
import { API } from '../../../config'; 
import StatusBox from '@/app/components/StatusBox';

export default function AgendarCitaPage() {
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', error: false });
    const [formData, setFormData] = useState({
        cliente_nombre: '',
        cliente_telefono: '',
        servicio_id: '',
        fecha: '',
        hora: ''
    });

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                // MODIFICACIÓN: Apuntamos a /productos ya que esa tabla es la que existe
                const baseUrl = API.endsWith('/') ? API.slice(0, -1) : API;
                const urlFinal = `${baseUrl}/productos`;
                
                console.log("DEBUG: Obteniendo servicios desde tabla productos:", urlFinal);

                const res = await fetch(urlFinal);
                if (!res.ok) throw new Error("No se pudieron obtener los servicios");
                
                const data = await res.json();
                
                // Si tu API de productos devuelve un objeto con un array (ej. { data: [] }), lo manejamos:
                const listaProductos = Array.isArray(data) ? data : (data.data || []);
                setServicios(listaProductos);
            } catch (err) {
                console.error("Error cargando servicios:", err);
                setMsg({ text: 'Error al conectar con el catálogo', error: true });
            }
        };
        fetchServicios();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.servicio_id) {
            setMsg({ text: 'Por favor selecciona un servicio', error: true });
            return;
        }

        setLoading(true);
        setMsg({ text: '', error: false });

        try {
            const res = await fetch(`${API}/citas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await res.json();

            if (res.ok) {
                setMsg({ text: '¡Cita agendada con éxito! 💈', error: false });
                setFormData({
                    cliente_nombre: '', cliente_telefono: '',
                    servicio_id: '', fecha: '', hora: ''
                });
                e.target.reset();
            } else {
                setMsg({ text: data.error || 'Error al agendar', error: true });
            }
        } catch (err) {
            setMsg({ text: 'Error de red: El servidor no responde', error: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
            <div className="mb-10 text-center">
                <h1 className="text-5xl font-black uppercase italic tracking-tighter">
                    Swift<span className="text-blue-600">Cut</span>
                </h1>
                <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">Reserva tu experiencia</p>
            </div>

            <div className="w-full max-w-md bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    
                    <div>
                        <label className="text-[10px] uppercase font-black text-zinc-500 ml-4 mb-2 block">Nombre Completo</label>
                        <input 
                            required
                            value={formData.cliente_nombre}
                            className="w-full bg-zinc-800 border-none p-4 rounded-2xl text-white placeholder-zinc-600 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                            placeholder="Ej. Juan Pérez" 
                            onChange={e => setFormData({...formData, cliente_nombre: e.target.value})} 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-black text-zinc-500 ml-4 mb-2 block">Teléfono</label>
                        <input 
                            required
                            type="tel"
                            value={formData.cliente_telefono}
                            className="w-full bg-zinc-800 border-none p-4 rounded-2xl text-white placeholder-zinc-600 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                            placeholder="Tu número de celular" 
                            onChange={e => setFormData({...formData, cliente_telefono: e.target.value})} 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-black text-zinc-500 ml-4 mb-2 block">Servicio (desde Productos)</label>
                        <select 
                            required
                            value={formData.servicio_id}
                            className="w-full bg-zinc-800 border-none p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer"
                            onChange={e => setFormData({...formData, servicio_id: e.target.value})}
                        >
                            <option value="" disabled>¿Qué te haremos hoy?</option>
                            {servicios.map(s => (
                                <option key={s.id} value={s.id} className="bg-zinc-900 text-white">
                                    {s.nombre} - ${s.precio}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] uppercase font-black text-zinc-500 ml-4 mb-2 block">Fecha</label>
                            <input 
                                required
                                type="date" 
                                value={formData.fecha}
                                className="w-full bg-zinc-800 border-none p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                style={{ colorScheme: 'dark' }}
                                onChange={e => setFormData({...formData, fecha: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-black text-zinc-500 ml-4 mb-2 block">Hora</label>
                            <input 
                                required
                                type="time" 
                                value={formData.hora}
                                className="w-full bg-zinc-800 border-none p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                style={{ colorScheme: 'dark' }}
                                onChange={e => setFormData({...formData, hora: e.target.value})} 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl font-black uppercase italic tracking-widest shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Procesando...' : 'Confirmar Cita'}
                    </button>
                </form>

                {msg.text && (
                    <div className={`mt-6 p-4 rounded-2xl text-center text-xs font-bold uppercase tracking-wider ${msg.error ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                        {msg.text}
                    </div>
                )}
            </div>
        </main>
    );
}