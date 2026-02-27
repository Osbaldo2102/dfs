'use client';
import { useState, useEffect, useCallback } from 'react';
import { API } from '../../../config'; 
import StatusBox from '@/app/components/StatusBox';

export default function AgendarCitaPage() {
    const [servicios, setServicios] = useState([]);
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingHoras, setLoadingHoras] = useState(false);
    const [msg, setMsg] = useState({ text: '', error: false });
    
    const [formData, setFormData] = useState({
        cliente_nombre: '',
        cliente_telefono: '',
        servicio_id: '',
        fecha: '',
        hora: ''
    });

    // 1. Cargar Catálogo de Productos/Servicios
    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const baseUrl = API.endsWith('/') ? API.slice(0, -1) : API;
                const res = await fetch(`${baseUrl}/productos`);
                if (!res.ok) throw new Error("No se pudieron obtener los servicios");
                const data = await res.json();
                const listaProductos = Array.isArray(data) ? data : (data.data || []);
                setServicios(listaProductos);
            } catch (err) {
                console.error("Error cargando servicios:", err);
                setMsg({ text: 'Error al conectar con el catálogo', error: true });
            }
        };
        fetchServicios();
    }, []);

    // 2. Consultar disponibilidad al cambiar la fecha
    const consultarDisponibilidad = useCallback(async (fechaSeleccionada) => {
    if (!fechaSeleccionada) return;
    
    setLoadingHoras(true);
    setHorariosDisponibles([]); 

    try {
        // 1. Limpiamos la URL de posibles barras diagonales dobles
        const baseUrl = API.endsWith('/') ? API.slice(0, -1) : API;
        const urlFinal = `${baseUrl}/citas/disponibles?fecha=${fechaSeleccionada}`;
        
        console.log("Intentando fetch a:", urlFinal); // ESTO TE DIRÁ SI LA URL ESTÁ ROTA

        const res = await fetch(urlFinal, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) throw new Error(`Error servidor: ${res.status}`);

        const data = await res.json();
        setHorariosDisponibles(data.disponibles || []);
    } catch (err) {
        // Aquí es donde te salta el SyntaxError si la URL está mal
        console.error("Error detallado:", err); 
        setMsg({ text: 'Error al cargar horarios. Revisa la consola.', error: true });
    } finally {
        setLoadingHoras(false);
    }
}, []);

    useEffect(() => {
        consultarDisponibilidad(formData.fecha);
    }, [formData.fecha, consultarDisponibilidad]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.servicio_id || !formData.hora) {
            setMsg({ text: 'Selecciona servicio y horario', error: true });
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
                setHorariosDisponibles([]);
            } else {
                setMsg({ text: data.error || 'Error al agendar', error: true });
            }
        } catch (err) {
            setMsg({ text: 'Error de red: El servidor no responde', error: true });
        } finally {
            setLoading(false);
        }
    };

    // Buscar nombre del servicio para el resumen
    const servicioSeleccionado = servicios.find(s => String(s.id) === String(formData.servicio_id));

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
                        <label className="text-[10px] uppercase font-black text-zinc-500 ml-4 mb-2 block">Servicio</label>
                        <select 
                            required
                            value={formData.servicio_id}
                            className="w-full bg-zinc-800 border-none p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer"
                            onChange={e => setFormData({...formData, servicio_id: e.target.value})}
                        >
                            <option value="" disabled>¿Qué te haremos hoy?</option>
                            {servicios.map(s => (
                                <option key={s.id} value={s.id}>{s.nombre} - ${s.precio}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-black text-zinc-500 ml-4 mb-2 block">Selecciona el día</label>
                        <input 
                            required
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.fecha}
                            className="w-full bg-zinc-800 border-none p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                            style={{ colorScheme: 'dark' }}
                            onChange={e => setFormData({...formData, fecha: e.target.value})} 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-black text-zinc-500 ml-4 mb-2 block">Horas Disponibles</label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {loadingHoras ? (
                                <p className="col-span-3 text-center text-zinc-600 text-[10px] animate-pulse">Consultando agenda...</p>
                            ) : horariosDisponibles.length > 0 ? (
                                horariosDisponibles.map(h => (
                                    <button
                                        key={h}
                                        type="button"
                                        onClick={() => setFormData({...formData, hora: h})}
                                        className={`p-3 rounded-xl text-xs font-bold transition-all border ${
                                            formData.hora === h 
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/40' 
                                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                                        }`}
                                    >
                                        {h}
                                    </button>
                                ))
                            ) : (
                                <p className="col-span-3 text-center text-zinc-600 text-[10px] py-4 bg-zinc-800/30 rounded-2xl">
                                    {formData.fecha ? 'No hay cupos disponibles' : 'Elige una fecha'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* BLOQUE DE RESUMEN DINÁMICO */}
                    {formData.hora && formData.servicio_id && (
                        <div className="mt-2 p-4 bg-blue-600/10 border border-blue-600/20 rounded-2xl animate-pulse">
                            <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em] mb-1 text-center">Resumen de Reserva</p>
                            <div className="flex justify-between items-center px-2">
                                <span className="text-xs font-bold text-white italic truncate mr-2">
                                    {servicioSeleccionado?.nombre || 'Servicio'}
                                </span>
                                <span className="text-xs font-black text-blue-500 uppercase whitespace-nowrap">
                                    {formData.hora} HS
                                </span>
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading || !formData.hora}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl font-black uppercase italic tracking-widest shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
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