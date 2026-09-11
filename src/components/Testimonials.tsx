import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { TESTIMONIALS } from '../data/initialData';
import { BusinessSettings } from '../types';

interface TestimonialsProps {
  settings: BusinessSettings;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ settings }) => {
  return (
    <section id="avaliacoes" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <span>⭐</span> Quem ama, recomenda
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
            Avaliações de quem confia na gente
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Veja o carinho e o reconhecimento dos tutores que confiam o banho, a tosa, a creche e a hospedagem ao Espaço Pet Ipatinga.
          </p>

          {/* Rating Summary Box */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-display">4,4</span>
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <div className="h-6 w-px bg-amber-200 hidden sm:block" />
            <div className="text-left text-xs sm:text-sm text-slate-700">
              <span className="font-bold block text-slate-900">20 avaliações no Google Maps</span>
              <span className="text-slate-500 text-xs">Média calculada a partir de clientes reais</span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all flex flex-col justify-between shadow-2xs group"
            >
              <div>
                {/* Header: Stars & Quote icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-amber-300 group-hover:text-amber-500 transition-colors" />
                </div>

                {/* Review Text */}
                <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed italic mb-6">
                  "{t.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white font-bold flex items-center justify-center text-xs">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.author}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      {t.date}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {t.pet}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
