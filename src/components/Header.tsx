import React, { useState } from 'react';
import { Phone, MapPin, Calendar, Menu, X, Shield, Clock, Instagram } from 'lucide-react';
import { BusinessSettings } from '../types';

interface HeaderProps {
  settings: BusinessSettings;
  onOpenBooking: (serviceCategory?: string) => void;
  onOpenAdmin: () => void;
  isAdminOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onOpenBooking,
  onOpenAdmin,
  isAdminOpen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Creche', href: '#creche' },
    { label: 'Hospedagem', href: '#hospedagem' },
    { label: 'Avaliações', href: '#avaliacoes' },
    { label: 'Galeria', href: '#galeria' },
    { label: 'Localização', href: '#localizacao' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-amber-100/80 transition-all">
      {/* Top micro-bar */}
      <div className="bg-amber-800 text-amber-50 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              {settings.address}, {settings.city} - {settings.state}
            </span>
            <span className="flex items-center gap-1 font-medium text-amber-200">
              <Clock className="w-3.5 h-3.5" />
              {settings.openingHours}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-amber-700/80 px-2 py-0.5 rounded-full text-[11px] font-medium text-amber-100">
              🚚 Serviço de Entrega Disponível
            </span>
            <a
              href={`https://wa.me/${settings.whatsapp}?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20Espa%C3%A7o%20Pet.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              {settings.phone}
            </a>
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-200 transition-colors"
              title="Instagram Oficial"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#inicio"
            id="header-logo-link"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <span className="text-2xl animate-paw select-none" role="img" aria-label="pata">🐾</span>
            </div>
            <div>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-800 font-display flex items-center gap-1">
                Espaço Pet <span className="text-amber-600 text-lg sm:text-xl font-normal">Ipatinga</span>
              </span>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-wide">
                Banho, Tosa e Hospedagem com Amor
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-semibold text-slate-700 hover:text-amber-600 transition-colors cursor-pointer py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-500 hover:after:w-full after:transition-all"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Direct Admin toggle button */}
            <button
              onClick={onOpenAdmin}
              id="header-admin-btn"
              title="Acesso Administrativo (Login)"
              className={`px-3 py-2 rounded-xl border transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                isAdminOpen
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'text-slate-700 hover:text-amber-700 bg-amber-50/70 border-amber-200/80 hover:border-amber-300 hover:bg-amber-100/60'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Login Admin</span>
            </button>

            {/* Agendar CTA */}
            <button
              id="header-agendar-cta-btn"
              onClick={() => onOpenBooking()}
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              AGENDAR SERVIÇO
            </button>

            {/* Mobile Hamburger Button */}
            <button
              id="header-mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-amber-50 hover:text-amber-600 focus:outline-none"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-amber-100 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2 mb-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-left py-2.5 px-3 rounded-lg text-slate-800 font-medium hover:bg-amber-50 hover:text-amber-600 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              id="mobile-agendar-btn"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              AGENDAR SERVIÇO
            </button>

            <a
              href={`https://wa.me/${settings.whatsapp}?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20Espa%C3%A7o%20Pet.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              WhatsApp {settings.phone}
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              id="mobile-admin-login-btn"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4 text-amber-600" />
              Acessar Painel Administrativo (Login)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
