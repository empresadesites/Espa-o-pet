import React from 'react';
import { Bath, Scissors, Sparkles, Sun, Home, Truck, ArrowUpRight, Check } from 'lucide-react';
import { ServiceItem, ServiceType } from '../types';

interface ServicesProps {
  services: ServiceItem[];
  onSelectService: (serviceCategory: ServiceType) => void;
  onOpenDeliveryChat: () => void;
}

export const Services: React.FC<ServicesProps> = ({
  services,
  onSelectService,
  onOpenDeliveryChat,
}) => {
  const getIcon = (category: ServiceType) => {
    switch (category) {
      case 'Banho':
        return <Bath className="w-7 h-7 text-amber-600" />;
      case 'Tosa':
        return <Scissors className="w-7 h-7 text-amber-600" />;
      case 'Banho + Tosa':
        return <Sparkles className="w-7 h-7 text-amber-600" />;
      case 'Creche':
        return <Sun className="w-7 h-7 text-amber-600" />;
      case 'Hospedagem':
        return <Home className="w-7 h-7 text-amber-600" />;
      case 'Entrega':
        return <Truck className="w-7 h-7 text-amber-600" />;
      default:
        return <Sparkles className="w-7 h-7 text-amber-600" />;
    }
  };

  const handleCardAction = (service: ServiceItem) => {
    if (service.category === 'Entrega') {
      onOpenDeliveryChat();
    } else {
      onSelectService(service.category);
    }
  };

  return (
    <section id="servicos" className="py-20 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            <span>✨</span> Nossos Serviços
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
            Tudo para o bem-estar do seu pet
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Estrutura planejada para proporcionar o mais alto nível de carinho, segurança, estética e recreação para cães e gatos.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.filter(s => s.isActive).map((service) => {
            const isFeatured = service.category === 'Banho + Tosa' || service.category === 'Creche';
            return (
              <div
                key={service.id}
                id={`card-servico-${service.id}`}
                className={`relative rounded-3xl bg-white p-8 transition-all duration-300 flex flex-col justify-between group ${
                  isFeatured
                    ? 'border-2 border-amber-400 shadow-lg shadow-amber-500/10 hover:shadow-xl'
                    : 'border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                    Mais Procurado
                  </div>
                )}

                <div>
                  {/* Icon & Category */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 group-hover:bg-amber-100/80 flex items-center justify-center transition-colors">
                      {getIcon(service.category)}
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Espaço Pet
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-slate-900 font-display mb-3 group-hover:text-amber-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Action Area */}
                <div className="pt-4 border-t border-slate-100 mt-auto">
                  {service.priceEstimate && (
                    <p className="text-xs text-slate-500 mb-3 font-medium">
                      {service.priceEstimate}
                    </p>
                  )}

                  <button
                    id={`btn-agendar-${service.id}`}
                    onClick={() => handleCardAction(service)}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isFeatured
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 hover:bg-amber-600 text-white'
                    }`}
                  >
                    <span>{service.buttonText}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight footer bar */}
        <div className="mt-12 bg-white rounded-2xl border border-amber-200/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 text-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold shrink-0">
              🚚
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Precisa que a gente busque seu pet?</p>
              <p className="text-xs text-slate-600">Possuímos transporte seguro e climatizado em Ipatinga.</p>
            </div>
          </div>
          <button
            onClick={onOpenDeliveryChat}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            SOLICITAR LEVA E TRAZ NO WHATSAPP
          </button>
        </div>

      </div>
    </section>
  );
};
