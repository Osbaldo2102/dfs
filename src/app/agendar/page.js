'use client';
import { useState, useEffect, useCallback } from 'react';
import { API } from '../../../config'; 
import Link from 'next/link'; // Importamos Link para la navegación

export default function AgendarCitaPage() {
    const [servicios, setServicios] = useState([]);
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingHoras, setLoadingHoras] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [msg, setMsg] = useState({ text: '', error: false });
    
    const [formData, setFormData] = useState({
        cliente_nombre: '',
        cliente_telefono: '',
        servicio_id: '',
        fecha: '',
        hora: ''
    });

    // 1. Cargar Catálogo y Verificar Sesión
    useEffect(() => {
        // Verificar si hay usuario en localStorage
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            const user = JSON.parse(storedUser);
            setIsLoggedIn(true);
            // Autorrellenar datos si existen
            setFormData(prev => ({
                ...prev,
                cliente_nombre: user.nombre || user.username || '',
                cliente_telefono: user.telefono || ''
            }));
        }

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

    // 2. Consultar disponibilidad
    const consultarDisponibilidad = useCallback(async (fechaSeleccionada) => {
        if (!fechaSeleccionada) return;
        setLoadingHoras(true);
        setHorariosDisponibles([]); 

        try {
            const baseUrl = API.endsWith('/') ? API.slice(0, -1) : API;
            const urlFinal = `${baseUrl}/citas/disponibles?fecha=${fechaSeleccionada}`;
            const res = await fetch(urlFinal);
            if (!res.ok) throw new Error(`Error servidor: ${res.status}`);
            const data = await res.json();
            setHorariosDisponibles(data.disponibles || []);
        } catch (err) {
            console.error("Error detallado:", err); 
        } finally {
            setLoadingHoras(false);
        }
    }, []);

    useEffect(() => {
        consultarDisponibilidad(formData.fecha);
    }, [formData.fecha, consultarDisponibilidad]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) return; // Protección extra

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
            
            if (res.ok) {
                setMsg({ text: '¡Cita agendada con éxito! 💈', error: false });
                setFormData(prev => ({ ...prev, fecha: '', hora: '' })); // Limpiar solo cita
                setHorariosDisponibles([]);
            } else {
                const data = await res.json();
                setMsg({ text: data.error || 'Error al agendar', error: true });
            }
        } catch (err) {
            setMsg({ text: 'Error de red: El servidor no responde', error: true });
        } finally {
            setLoading(false);
        }
    };

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

                    {/* RESUMEN DINÁMICO */}
                    {formData.hora && formData.servicio_id && (
                        <div className="mt-2 p-4 bg-blue-600/10 border border-blue-600/20 rounded-2xl">
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

                    {/* BOTÓN PROTEGIDO POR LOGIN */}
                    {isLoggedIn ? (
                        <button 
                            type="submit" 
                            disabled={loading || !formData.hora}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl font-black uppercase italic tracking-widest shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-30"
                        >
                            {loading ? 'Procesando...' : 'Confirmar Cita'}
                        </button>
                    ) : (
                        <div className="mt-4 flex flex-col gap-3 text-center">
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Inicia sesión para reservar este turno</p>
                            <Link 
                                href="/login" 
                                className="bg-white text-black p-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                            >
                                Iniciar Sesión
                            </Link>
                        </div>
                    )}
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