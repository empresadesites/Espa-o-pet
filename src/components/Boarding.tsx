import React from 'react';
import { Home, Moon, Camera, HeartHandshake, ShieldCheck, ArrowRight, Calendar } from 'lucide-react';

interface BoardingProps {
  onSelectHospedagem: () => void;
}

export const Boarding: React.FC<BoardingProps> = ({ onSelectHospedagem }) => {
  const highlights = [
    {
      icon: <Moon className="w-5 h-5 text-amber-500" />,
      title: 'Dormitórios Confortáveis',
      description: 'Caminhas higienizadas, climatização suave e ambiente calmo para uma noite tranquila.',
    },
    {
      icon: <Camera className="w-5 h-5 text-amber-500" />,
      title: 'Fotos e Notícias no WhatsApp',
      description: 'Enviamos fotos e atualizações diárias para você viajar com o coração em paz.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-amber-500" />,
      title: 'Alimentação e Cuidados Próprios',
      description: 'Seguimos à risca os horários de alimentação, dosagem de ração e eventuais medicações.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-500" />,
      title: 'Segurança e Supervisão',
      description: 'Estrutura fechada, sem risco de fuga, com acompanhamento carinhoso de cuidadores.',
    },
  ];

  return (
    <section id="hospedagem" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background warm lights */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual card */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80"
                  alt="Pet dormindo feliz na hospedagem do Espaço Pet"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>

              {/* Overlapping badge */}
              <div className="sm:absolute -bottom-6 -left-6 mt-4 sm:mt-0 bg-slate-800/90 backdrop-blur-md p-5 rounded-2xl border border-slate-700 max-w-xs shadow-xl">
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
                  🏠 Hospedagem Afetiva
                </p>
                <p className="text-sm font-semibold text-slate-200">
                  Seu pet fica confortável, seguro e recebendo muito carinho enquanto você viaja tranquilo.
                </p>
              </div>
            </div>
          </div>

          {/* Copy and CTA */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
              <span>🏠</span> Hospedagem com Amor
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display leading-[1.2]">
              Vai viajar? Seu pet também merece férias.
            </h2>

            <p className="text-lg text-slate-300 font-normal leading-relaxed">
              Conte com o Espaço Pet para proporcionar ao seu pet uma estadia com cuidado, atenção e diversão enquanto você estiver fora.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {highlights.map((h) => (
                <div key={h.title} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
                    {h.icon}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{h.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{h.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                id="btn-solicitar-hospedagem"
                onClick={onSelectHospedagem}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-amber-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                SOLICITAR HOSPEDAGEM
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
