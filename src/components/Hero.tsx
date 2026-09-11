import React from 'react';
import { Calendar, ArrowRight, Star, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { BusinessSettings } from '../types';

interface HeroProps {
  settings: BusinessSettings;
  onOpenBooking: () => void;
  onScrollToAbout: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onOpenBooking,
  onScrollToAbout,
}) => {
  return (
    <section id="inicio" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-amber-50/70 via-white to-[#FAF8F5]">
      {/* Decorative subtle background shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 -ml-20 w-80 h-80 rounded-full bg-orange-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy, Highlights, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs sm:text-sm font-semibold shadow-xs">
              <span className="flex text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
              </span>
              <span>Classificação <strong>{settings.googleRating}/5</strong> no Google Maps</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-amber-800">{settings.googleReviewsCount} avaliações reais</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] font-display">
              Seu pet merece um lugar onde possa brincar, se cuidar e ser feliz.{' '}
              <span className="inline-block animate-paw text-amber-500">🐾</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Banho, tosa, creche e hospedagem com muito carinho, diversão e atenção para o seu melhor amigo.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="hero-agendar-servico-btn"
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-base shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                AGENDAR SERVIÇO
              </button>

              <button
                id="hero-conhecer-espaco-btn"
                onClick={onScrollToAbout}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-amber-300 font-bold text-base shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                CONHECER O ESPAÇO
                <ArrowRight className="w-4 h-4 text-amber-600" />
              </button>
            </div>

            {/* 4 Feature highlight pills */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 border border-slate-100 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">4,4/5 no Google</p>
                  <p className="text-[11px] text-slate-500 leading-none">Avaliações reais</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 border border-slate-100 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <span className="text-sm">🐾</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">20 avaliações</p>
                  <p className="text-[11px] text-slate-500 leading-none">Clientes fiéis</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 border border-slate-100 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">Cuidado e carinho</p>
                  <p className="text-[11px] text-slate-500 leading-none">Profissionais dedicados</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 border border-slate-100 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <span className="text-sm">🎾</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">Diversão para pets</p>
                  <p className="text-[11px] text-slate-500 leading-none">Espaço enriquecido</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Image with Floating Highlights */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-4/5">
                <img
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=80"
                  alt="Cachorrinho feliz e bem cuidado no Espaço Pet Ipatinga"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-500"
                />
                
                {/* Gradient overlay on bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block px-2.5 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold mb-1 shadow-xs">
                    Ipatinga • Cariru
                  </span>
                  <p className="text-sm font-semibold leading-snug drop-shadow-sm">
                    Espaço acolhedor projetado especialmente para cães e gatos.
                  </p>
                </div>
              </div>

              {/* Floating Badge 1: Nino Review quote */}
              <div className="absolute -top-4 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-amber-100 max-w-[240px] hidden sm:block animate-pulse">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                    ★
                  </div>
                  <span className="text-xs font-bold text-slate-800">"Experiência única!"</span>
                </div>
                <p className="text-[11px] text-slate-600 italic">
                  "O Nino ama ir para a creche, brincar e adora a equipe!"
                </p>
              </div>

              {/* Floating Badge 2: Delivery & Safety */}
              <div className="absolute -bottom-5 -right-2 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Segurança & Conforto</p>
                  <p className="text-[11px] text-slate-500">Leva e Traz com ar-condicionado</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
