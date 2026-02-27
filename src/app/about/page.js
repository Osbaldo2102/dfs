'use client';

export default function NosotrosPage() {
  return (
    <main className="min-h-[90vh] flex items-center justify-center p-4 md:p-10">
      {/* Tarjeta Principal Premium */}
      <section className="bg-white rounded-[4rem] shadow-2xl shadow-blue-500/10 max-w-6xl w-full overflow-hidden border border-slate-50 flex flex-col md:flex-row">
        
        {/* Lado Izquierdo: Impacto Visual */}
        <div className="md:w-2/5 bg-zinc-900 p-12 flex flex-col justify-center text-white relative overflow-hidden">
          {/* Círculos decorativos de fondo */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-30"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400 rounded-full blur-[80px] opacity-20"></div>
          
          <h1 className="text-6xl font-black italic uppercase leading-none tracking-tighter mb-6 relative z-10">
            Sobre <br />
            <span className="text-blue-500">Nosotros</span>
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-xs relative z-10">
            SwiftCut v2.0
          </p>
        </div>

        {/* Lado Derecho: Contenido */}
        <div className="md:w-3/5 p-10 md:p-20 bg-white relative">
          <div className="max-w-xl">
            <h2 className="text-3xl font-black text-zinc-800 uppercase mb-6 italic border-b-4 border-blue-600 inline-block">
              Nuestra Misión
            </h2>
            
            <p className="text-xl text-zinc-600 leading-relaxed mb-10 font-medium">
              Proyecto FullStack <span className="text-blue-600 font-bold">"Gestión de Citas para Barbers"</span>. 
              Es un desarrollo web de última generación que permite digitalizar y optimizar la agenda de barberías modernas.
            </p>

            {/* Grid de Características con Figuras */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="group">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  ⚡
                </div>
                <h4 className="font-black uppercase text-zinc-800 text-sm mb-2">Velocidad</h4>
                <p className="text-zinc-500 text-xs leading-relaxed">Interfaz optimizada para reservas en menos de 60 segundos.</p>
              </div>

              <div className="group">
                <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-600 transition-all duration-300 shadow-md">
                  🛡️
                </div>
                <h4 className="font-black uppercase text-zinc-800 text-sm mb-2">Seguridad</h4>
                <p className="text-zinc-500 text-xs leading-relaxed">Protección de datos mediante JWT y roles de usuario/admin.</p>
              </div>

              <div className="group">
                <div className="w-12 h-12 bg-zinc-100 text-zinc-800 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  📱
                </div>
                <h4 className="font-black uppercase text-zinc-800 text-sm mb-2">Responsive</h4>
                <p className="text-zinc-500 text-xs leading-relaxed">Diseñado para verse impecable tanto en PC como en móviles.</p>
              </div>

              <div className="group">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-blue-500/30">
                  💈
                </div>
                <h4 className="font-black uppercase text-zinc-800 text-sm mb-2">Especializado</h4>
                <p className="text-zinc-500 text-xs leading-relaxed">Enfoque total en el flujo de trabajo de una barbería profesional.</p>
              </div>
            </div>

            {/* Footer de la tarjeta */}
            <footer className="mt-16 pt-6 border-t border-zinc-100">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                © 2026 SwiftCut - Fase Final Backend & Frontend
              </p>
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
}