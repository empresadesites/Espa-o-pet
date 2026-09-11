import React from 'react';
import { Phone, MapPin, Clock, Instagram, Shield, Heart, Truck, Sparkles } from 'lucide-react';
import { BusinessSettings } from '../types';

interface FooterProps {
  settings: BusinessSettings;
  onOpenAdmin: () => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  onOpenBooking,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                🐾
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-display">
                Espaço Pet <span className="text-amber-500 font-normal">Ipatinga</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Banho, tosa, creche e hospedagem com muito carinho, diversão e atenção para o seu melhor amigo. Ambiente acolhedor e seguro no Cariru, Ipatinga - MG.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Instagram Oficial"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="WhatsApp Oficial"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm">
              {['Início', 'Sobre', 'Serviços', 'Creche', 'Hospedagem', 'Avaliações', 'Galeria', 'Localização'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Quicklist */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Cuidados Pet
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>🛁 Banho relaxante com hidratação</li>
              <li>✂️ Tosa geral e higiênica</li>
              <li>🐾 Banho + Tosa completo</li>
              <li>🎾 Creche com recreação diária</li>
              <li>🏠 Hospedagem monitorada</li>
              <li>🚚 Serviço de Leva e Traz em Ipatinga</li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="lg:col-span-3 space-y-3 text-sm">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Onde Estamos
            </h4>
            <p className="flex items-start gap-2.5 text-slate-300 leading-snug">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
              <span>{settings.address}, {settings.neighborhood}, {settings.city} - {settings.state}, {settings.cep}</span>
            </p>

            <p className="flex items-center gap-2.5 text-slate-300">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <a href={`https://wa.me/${settings.whatsapp}`} className="hover:text-emerald-300 transition-colors">
                {settings.phone}
              </a>
            </p>

            <p className="flex items-center gap-2.5 text-slate-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.openingHours}</span>
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
              >
                AGENDAR ATENDIMENTO
              </button>
            </div>
          </div>

        </div>

        {/* Bottom micro bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {currentYear} Espaço Pet Ipatinga. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Feito com carinho para cães e gatos <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            </span>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              id="footer-admin-link"
              className="text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Área Restrita / Painel Admin</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
