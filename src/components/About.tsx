import React from 'react';
import { Heart, Sparkles, Shield, Award, Users, CheckCircle2, Truck } from 'lucide-react';
import { BusinessSettings } from '../types';

interface AboutProps {
  settings: BusinessSettings;
  onOpenBooking: () => void;
}

export const About: React.FC<AboutProps> = ({ settings, onOpenBooking }) => {
  return (
    <section id="sobre" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Images collage */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              {/* Main Photo */}
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-amber-50">
                <img
                  src="https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80"
                  alt="Cuidado carinhoso com pet no Espaço Pet"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>

              {/* Secondary overlapping card */}
              <div className="sm:absolute -bottom-8 -right-6 mt-4 sm:mt-0 bg-amber-500 text-white p-6 rounded-2xl shadow-xl max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight">Amor & Confiança</h4>
                    <p className="text-xs text-amber-100">Avaliado com 4,4 estrelas</p>
                  </div>
                </div>
                <p className="text-xs text-amber-50 leading-relaxed">
                  "Melhor lugar e melhores pessoas! Muito cuidadosos e atenciosos com os pets!"
                </p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-100/70 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <span>🐾</span> Conheça nossa história
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Muito mais que um Pet Shop
            </h2>

            <p className="text-lg text-slate-700 font-medium leading-relaxed">
              No Espaço Pet Ipatinga, seu pet encontra um ambiente preparado para receber, cuidar e proporcionar momentos de diversão.
            </p>

            <p className="text-slate-600 leading-relaxed text-base">
              Fundado com o propósito de oferecer uma experiência verdadeiramente acolhedora para os animais em Ipatinga, contamos com uma equipe dedicada que compreende as necessidades de cada cãozinho e gatinho. Aqui, seu melhor amigo é tratado com respeito, carinho e total atenção em todas as etapas — seja no banho relaxante, na tosa estilizada, na recreação da creche ou durante a hospedagem.
            </p>

            {/* Core pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Profissionais Atenciosos</h4>
                  <p className="text-xs text-slate-600">Equipe treinada, paciente e apaixonada pelo que faz.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Ambiente Seguro & Higiênico</h4>
                  <p className="text-xs text-slate-600">Espaço higienizado constantemente e livre de estresse.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Bem-Estar em 1º Lugar</h4>
                  <p className="text-xs text-slate-600">Rotinas pensadas para o conforto emocional e físico do animal.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Truck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Leva e Traz Próprio</h4>
                  <p className="text-xs text-slate-600">Comodidade com entrega e busca segura em Ipatinga.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                AGENDAR UMA VISITA OU SERVIÇO
              </button>

              <a
                href={`https://wa.me/${settings.whatsapp}?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20o%20Espa%C3%A7o%20Pet.`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 transition-colors"
              >
                Falar no WhatsApp &rarr;
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
