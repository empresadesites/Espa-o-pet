import React from 'react';
import { MapPin, Phone, Clock, Navigation, Truck, ExternalLink, Shield } from 'lucide-react';
import { BusinessSettings } from '../types';

interface LocationAndHoursProps {
  settings: BusinessSettings;
}

export const LocationAndHours: React.FC<LocationAndHoursProps> = ({ settings }) => {
  const fullAddress = `${settings.address}, ${settings.neighborhood}, ${settings.city} - ${settings.state}, ${settings.cep}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Espaço Pet Ipatinga, ${settings.address}, Cariru, Ipatinga - MG`)}`;

  return (
    <section id="localizacao" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <span>📍</span> Localização & Contato
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
            Venha conhecer o Espaço Pet
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Localizado no bairro nobre do Cariru em Ipatinga, com fácil acesso, estacionamento e total segurança para você e seu companheiro.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Info Card */}
          <div className="lg:col-span-5 bg-[#FAF8F5] rounded-3xl p-8 border border-amber-100 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Endereço</h3>
                  <p className="text-sm text-slate-700 font-medium mt-1 leading-snug">
                    {settings.address}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {settings.neighborhood}, {settings.city} - {settings.state}, {settings.cep}
                  </p>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Telefone / WhatsApp</h3>
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20Espa%C3%A7o%20Pet.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-emerald-700 font-extrabold mt-1 block hover:underline"
                  >
                    {settings.phone}
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Atendimento ágil para agendamentos e dúvidas
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Horário de Funcionamento</h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>{settings.openingHours}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">
                    Segunda a Sábado com agendamentos programados.
                  </p>
                </div>
              </div>

              {/* Delivery Service */}
              <div className="p-4 rounded-2xl bg-amber-100/60 border border-amber-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                    Entrega Disponível (Leva e Traz)
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Buscamos seu pet em casa para banho, tosa ou hospedagem com veículo seguro e arejado.
                  </p>
                </div>
              </div>

            </div>

            {/* Como Chegar CTA Button */}
            <div className="pt-2">
              <a
                id="btn-como-chegar-google-maps"
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm tracking-wide shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                COMO CHEGAR
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>

          {/* Interactive Map Container */}
          <div className="lg:col-span-7 bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-xs relative min-h-[380px] flex flex-col">
            <iframe
              title="Mapa de localização do Espaço Pet Ipatinga"
              src="https://maps.google.com/maps?q=Rua+Guatemala,+311+-+Cariru,+Ipatinga+-+MG&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[380px] border-0 flex-1"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            
            {/* Map Overlay Badge */}
            <div className="p-4 bg-white/95 backdrop-blur-sm border-t border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🐾</span>
                <span className="text-xs font-bold text-slate-800">
                  Espaço Pet Ipatinga • R. Guatemala, 311, Cariru
                </span>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                Abrir no app Google Maps &rarr;
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
