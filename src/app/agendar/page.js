'use client';
import { useState, useEffect } from 'react';
import { API } from '@/config'; 
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
                const res = await fetch(`${API}/servicios`);
                const data = await res.json();
                setServicios(data);
            } catch (err) {
                console.error("Error cargando servicios", err);
            }
        };
        fetchServicios();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                setMsg({ text: '¡Cita agendada! Te esperamos en SwiftCut 💈', error: false });
                e.target.reset();
            } else {
                setMsg({ text: data.error || 'Error al agendar', error: true });
            }
        } catch (err) {
            setMsg({ text: 'No se pudo conectar con el servidor', error: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
            {/* Logo o Titulo */}
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
                            className="w-full bg-zinc-800 border-none p-4 rounded-2xl text-white placeholder-zinc-600 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                            placeholder="Ej. Juan Pérez" 
                            onChange={e => setFormData({...formData, cliente_nombre: e.target.value})} 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-black text-zinc-500 ml-4 mb-2 block">Teléfono de contacto</label>
                        <input 
                            required
                            type="tel"
                            className="w-full bg-zinc-800 border-none p-4 rounded-2xl text-white placeholder-zinc-600 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                            placeholder="Tu número de celular" 
                            onChange={e => setFormData({...formData, cliente_telefono: e.target.value})} 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-black text-zinc-500 ml-4 mb-2 block">Selecciona el Servicio</label>
                        <select 
                            required
                            className="w-full bg-zinc-800 border-none p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none"
                            onChange={e => setFormData({...formData, servicio_id: e.target.value})}
                        >
                            <option value="">¿Qué te haremos hoy?</option>
                            {servicios.map(s => <option key={s.id} value={s.id}>{s.nombre} - ${s.precio}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] uppercase font-black text-zinc-500 ml-4 mb-2 block">Fecha</label>
                            <input 
                                required
                                type="date" 
                                className="w-full bg-zinc-800 border-none p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                onChange={e => setFormData({...formData, fecha: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-black text-zinc-500 ml-4 mb-2 block">Hora</label>
                            <input 
                                required
                                type="time" 
                                className="w-full bg-zinc-800 border-none p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
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
                    <div className={`mt-6 p-4 rounded-2xl text-center text-xs font-bold uppercase tracking-wider ${msg.error ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {msg.text}
                    </div>
                )}
            </div>
            
            <footer className="mt-10">
                <p className="text-zinc-600 text-[9px] uppercase font-bold tracking-[0.5em]">Luxury Grooming Experience</p>
            </footer>
        </main>
    );
}