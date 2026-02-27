import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 font-sans">
      
      {/* SECCIÓN HERO: Ahora con tipografía masiva y mayor impacto */}
      <section className="bg-white rounded-[4rem] p-16 md:p-28 shadow-2xl shadow-blue-500/10 text-center mb-16 border border-slate-50 relative overflow-hidden">
        {/* Decoración sutil de fondo para profundidad */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-gray-900 leading-[0.85]">
            Gestiona tus Citas con <br />
            <span className="text-blue-600 italic">SwiftCut</span>
          </h1>
          
          <p className="text-gray-500 text-lg md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            La plataforma profesional para barberías y centros de estética. 
            Organiza tu tiempo y haz crecer tu negocio con un solo clic.
          </p>
          
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/register" className="bg-blue-600 text-white px-12 py-5 rounded-full font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/40 no-underline active:scale-95">
              Comenzar Gratis
            </Link>
            <Link href="/login" className="bg-white text-blue-600 border-2 border-blue-600 px-12 py-5 rounded-full font-black text-xl hover:bg-blue-50 transition-all no-underline active:scale-95">
              Iniciar Sesión
            </Link>
          </nav>
        </div>
      </section>

      {/* GRID DE BENEFICIOS: Tarjetas con más aire y tipografía robusta */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { 
            icon: "📅", 
            title: "Agenda Inteligente", 
            desc: "Evita cruces de horarios y organiza tu jornada fácilmente desde cualquier dispositivo." 
          },
          { 
            icon: "⚡", 
            title: "Rápido y Fácil", 
            desc: "Tus clientes reservan en menos de un minuto. Sin llamadas, sin esperas, 24/7." 
          },
          { 
            icon: "🛡️", 
            title: "Panel de Control", 
            desc: "Gestiona tus servicios, precios y personal de manera segura y centralizada." 
          }
        ].map((f, i) => (
          <article 
            key={i} 
            className="bg-white p-12 rounded-[3.5rem] shadow-xl shadow-gray-200/50 text-center border border-slate-50 transition-all hover:scale-105 hover:shadow-2xl"
          >
            <div className="text-6xl mb-8 inline-block p-4 bg-gray-50 rounded-3xl">{f.icon}</div>
            <h2 className="text-2xl font-black mb-4 text-gray-800 uppercase tracking-tight">{f.title}</h2>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">{f.desc}</p>
          </article>
        ))}
      </section>

      {/* Footer Minimalista */}
      <footer className="mt-24 text-center">
        <p className="text-zinc-300 text-[10px] font-black uppercase tracking-[0.6em]">
          Innovación • Estilo • Control
        </p>
      </footer>
    </main>
  );
}