import React, { useState, useEffect } from 'react';
import { ServiceType, BusinessSettings, ServiceItem } from './types';
import { StorageService } from './services/storage';

// Public Components
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Daycare } from './components/Daycare';
import { Boarding } from './components/Boarding';
import { Testimonials } from './components/Testimonials';
import { Gallery } from './components/Gallery';
import { Booking } from './components/Booking';
import { LocationAndHours } from './components/LocationAndHours';
import { InstagramSection } from './components/InstagramSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [settings, setSettings] = useState<BusinessSettings>(StorageService.getSettings());
  const [services, setServices] = useState<ServiceItem[]>(StorageService.getServices());
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceType>('Banho + Tosa');

  // Admin routing & auth state
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);

  // Sync settings when changed from admin
  useEffect(() => {
    const handleStorageUpdate = () => {
      setSettings(StorageService.getSettings());
      setServices(StorageService.getServices());
    };

    window.addEventListener('espaco_pet_data_updated', handleStorageUpdate);

    // Check if initial hash or path is /admin
    if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
      setIsAdminRoute(true);
      if (!isAdminAuthenticated) {
        setShowAdminLoginModal(true);
      }
    }

    // Listen to hash changes
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminRoute(true);
        if (!isAdminAuthenticated) {
          setShowAdminLoginModal(true);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('espaco_pet_data_updated', handleStorageUpdate);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isAdminAuthenticated]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) {
      setSelectedServiceForBooking(serviceName as ServiceType);
    }
    scrollToSection('agendamento');
  };

  const handleOpenDeliveryChat = () => {
    const message = encodeURIComponent(
      'Olá! Gostaria de saber mais sobre o serviço de entrega e busca (Leva e Traz) do Espaço Pet Ipatinga.'
    );
    window.open(`https://wa.me/${settings.whatsapp}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminRoute(true);
    } else {
      setShowAdminLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setShowAdminLoginModal(false);
    setIsAdminRoute(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminRoute(false);
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    }
  };

  // If the admin route is active and the user is authenticated, render the dedicated admin dashboard
  if (isAdminRoute && isAdminAuthenticated) {
    return (
      <AdminDashboard
        onLogout={handleAdminLogout}
        onClose={() => {
          setIsAdminRoute(false);
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col selection:bg-amber-200 selection:text-amber-900 relative">
      
      {/* Header */}
      <Header
        settings={settings}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={handleOpenAdmin}
        isAdminOpen={isAdminRoute && isAdminAuthenticated}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          settings={settings}
          onOpenBooking={() => handleOpenBooking()}
          onScrollToAbout={() => scrollToSection('sobre')}
        />

        {/* About Section ("Muito mais que um Pet Shop") */}
        <About
          settings={settings}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* Services Section ("Tudo para o bem-estar do seu pet") */}
        <Services
          services={services}
          onSelectService={(cat) => handleOpenBooking(cat)}
          onOpenDeliveryChat={handleOpenDeliveryChat}
        />

        {/* Daycare Section ("Aqui seu pet também pode se divertir! 🎾") */}
        <Daycare
          onSelectCreche={() => handleOpenBooking('Creche')}
        />

        {/* Boarding Section ("Vai viajar? Seu pet também merece férias.") */}
        <Boarding
          onSelectHospedagem={() => handleOpenBooking('Hospedagem')}
        />

        {/* Testimonials Section (Real Google 4.4⭐ reviews) */}
        <Testimonials
          settings={settings}
        />

        {/* Photo Gallery with filters and lightbox */}
        <Gallery />

        {/* Booking Engine with Dynamic Form & WhatsApp Integration */}
        <Booking
          initialService={selectedServiceForBooking}
        />

        {/* Location & Operating Hours Section */}
        <LocationAndHours
          settings={settings}
        />

        {/* Instagram Community Section */}
        <InstagramSection
          settings={settings}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={handleOpenAdmin}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp
        whatsappNumber={settings.whatsapp}
      />

      {/* Admin Login Modal (when requested) */}
      {showAdminLoginModal && (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setShowAdminLoginModal(false)}
        />
      )}

    </div>
  );
}
