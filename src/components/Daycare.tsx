import React from 'react';
import { Sun, Heart, Eye, Smile, Sparkles, Check, ArrowRight } from 'lucide-react';

interface DaycareProps {
  onSelectCreche: () => void;
}

export const Daycare: React.FC<DaycareProps> = ({ onSelectCreche }) => {
  const benefits = [
    {
      icon: '🐾',
      title: 'Socialização',
      description: 'Convívio saudável com outros cães do mesmo porte e temperamento.',
    },
    {
      icon: '🎾',
      title: 'Brincadeiras',
      description: 'Atividades recreativas e enriquecimento ambiental ao longo do dia.',
    },
    {
      icon: '❤️',
      title: 'Carinho',
      description: 'Atenção afetiva para que seu pet se sinta seguro e acolhido como em casa.',
    },
    {
      icon: '👀',
      title: 'Atenção aos pets',
      description: 'Supervisão contínua por profissionais experientes em comportamento.',
    },
    {
      icon: '😊',
      title: 'Ambiente divertido',
      description: 'Espaço arejado, limpo e dinâmico onde não existe tédio.',
    },
  ];

  return (
    <section id="creche" className="py-20 bg-amber-50/50 relative overflow-hidden">
      {/* Decorative dots */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Benefits */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-200/70 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <span>🎾</span> Creche & Recreação Canina
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display leading-[1.2]">
              Aqui seu pet também pode se divertir!{' '}
              <span className="inline-block text-amber-600">🎾</span>
            </h2>

            <p className="text-lg text-slate-700 leading-relaxed font-normal">
              Um espaço para brincar, socializar e aproveitar o dia com muito carinho e atenção.
            </p>

            {/* List of benefits */}
            <div className="space-y-3 pt-2">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/90 border border-amber-100 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{b.title}</h4>
                    <p className="text-xs text-slate-600 leading-snug">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                id="btn-daycare-saiba-mais"
                onClick={onSelectCreche}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm tracking-wide shadow-md shadow-amber-600/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                QUERO SABER MAIS
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Dogs playing photo montage */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-white aspect-4/5">
                  <img
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80"
                    alt="Cachorros socializando felizes"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-white aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=600&q=80"
                    alt="Cachorro brincando com bola"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-white aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80"
                    alt="Pet sorrindo e relaxado"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-white aspect-4/5">
                  <img
                    src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80"
                    alt="Filhote seguro e acolhido"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Testimonial highlight bubble */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white py-3 px-6 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-3 w-11/12 max-w-sm">
              <span className="text-xl">🐶</span>
              <p className="text-xs font-medium leading-tight">
                <strong>Bentinho & Nino</strong> são apaixonados pela nossa creche diária!
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
