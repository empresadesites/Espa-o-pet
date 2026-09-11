import { Appointment, AppointmentStatus, BusinessSettings, ServiceItem, BlockedTimeSlot } from '../types';
import { INITIAL_APPOINTMENTS, INITIAL_SERVICES, INITIAL_SETTINGS } from '../data/initialData';

const APPOINTMENTS_KEY = 'espaco_pet_appointments_v1';
const SERVICES_KEY = 'espaco_pet_services_v1';
const SETTINGS_KEY = 'espaco_pet_settings_v1';
const BLOCKED_SLOTS_KEY = 'espaco_pet_blocked_slots_v1';

export class StorageService {
  private static notifyChange() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('espaco_pet_data_updated'));
    }
  }

  // APPOINTMENTS
  static getAppointments(): Appointment[] {
    if (typeof window === 'undefined') return INITIAL_APPOINTMENTS;
    const data = localStorage.getItem(APPOINTMENTS_KEY);
    if (!data) {
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
      return INITIAL_APPOINTMENTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  }

  static addAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Appointment {
    const list = this.getAppointments();
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'pendente',
      createdAt: new Date().toISOString(),
    };
    const updated = [newAppointment, ...list];
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
    this.notifyChange();
    return newAppointment;
  }

  static updateAppointmentStatus(id: string, status: AppointmentStatus): void {
    const list = this.getAppointments();
    const updated = list.map((item) => (item.id === id ? { ...item, status } : item));
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
    this.notifyChange();
  }

  static deleteAppointment(id: string): void {
    const list = this.getAppointments();
    const updated = list.filter((item) => item.id !== id);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
    this.notifyChange();
  }

  // SERVICES
  static getServices(): ServiceItem[] {
    if (typeof window === 'undefined') return INITIAL_SERVICES;
    const data = localStorage.getItem(SERVICES_KEY);
    if (!data) {
      localStorage.setItem(SERVICES_KEY, JSON.stringify(INITIAL_SERVICES));
      return INITIAL_SERVICES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_SERVICES;
    }
  }

  static saveService(service: ServiceItem): void {
    const list = this.getServices();
    const index = list.findIndex((s) => s.id === service.id);
    let updated: ServiceItem[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = service;
    } else {
      updated = [...list, service];
    }
    localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));
    this.notifyChange();
  }

  static deleteService(id: string): void {
    const list = this.getServices();
    const updated = list.filter((s) => s.id !== id);
    localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));
    this.notifyChange();
  }

  // SETTINGS
  static getSettings(): BusinessSettings {
    if (typeof window === 'undefined') return INITIAL_SETTINGS;
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_SETTINGS;
    }
  }

  static saveSettings(settings: BusinessSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    this.notifyChange();
  }

  // BLOCKED SLOTS
  static getBlockedSlots(): BlockedTimeSlot[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(BLOCKED_SLOTS_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static toggleBlockSlot(date: string, time: string): boolean {
    const slots = this.getBlockedSlots();
    const existingIndex = slots.findIndex((s) => s.date === date && s.time === time);
    let updated: BlockedTimeSlot[];
    let isBlockedNow = false;
    if (existingIndex >= 0) {
      updated = slots.filter((_, i) => i !== existingIndex);
      isBlockedNow = false;
    } else {
      updated = [...slots, { date, time, reason: 'Bloqueado pelo administrador' }];
      isBlockedNow = true;
    }
    localStorage.setItem(BLOCKED_SLOTS_KEY, JSON.stringify(updated));
    this.notifyChange();
    return isBlockedNow;
  }

  static isSlotOccupied(date: string, time: string): boolean {
    const blocked = this.getBlockedSlots();
    if (blocked.some((b) => b.date === date && b.time === time)) {
      return true;
    }
    const appointments = this.getAppointments();
    return appointments.some(
      (a) =>
        a.status !== 'cancelado' &&
        a.date === date &&
        a.time === time &&
        (a.service === 'Banho' || a.service === 'Tosa' || a.service === 'Banho + Tosa')
    );
  }

  // STATS
  static getStats() {
    const appointments = this.getAppointments();
    const todayStr = new Date().toISOString().split('T')[0];

    const todayAppointments = appointments.filter((a) => a.date === todayStr);
    const pending = appointments.filter((a) => a.status === 'pendente');
    const confirmed = appointments.filter((a) => a.status === 'confirmado');
    const daycarePets = appointments.filter(
      (a) => a.service === 'Creche' && a.status === 'confirmado'
    );
    const hostedPets = appointments.filter(
      (a) => a.service === 'Hospedagem' && a.status === 'confirmado'
    );

    // unique clients based on whatsapp or name
    const uniqueClients = new Set(
      appointments.map((a) => (a.client.whatsapp || a.client.name).toLowerCase().trim())
    );

    return {
      todayCount: todayAppointments.length,
      pendingCount: pending.length,
      confirmedCount: confirmed.length,
      daycareCount: daycarePets.length,
      boardingCount: hostedPets.length,
      totalClients: Math.max(uniqueClients.size, 12),
    };
  }

  // BUILD WHATSAPP MESSAGE
  static generateWhatsAppMessage(appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>): string {
    const lines: string[] = [
      '🐾 *NOVO AGENDAMENTO — ESPAÇO PET IPATINGA*',
      '',
      `👤 *Responsável:* ${appointment.client.name}`,
      `📱 *WhatsApp:* ${appointment.client.whatsapp}`,
    ];

    if (appointment.client.email) {
      lines.push(`✉️ *E-mail:* ${appointment.client.email}`);
    }

    lines.push(
      `🐶 *Pet:* ${appointment.pet.name}`,
      `🐾 *Espécie:* ${appointment.pet.species}`,
      `🧬 *Raça:* ${appointment.pet.breed || 'Não informada'}`,
      `🎂 *Idade:* ${appointment.pet.age || 'Não informada'}`
    );

    if (appointment.pet.gender) {
      lines.push(`⚧ *Sexo:* ${appointment.pet.gender}`);
    }

    lines.push(
      `📏 *Porte:* ${appointment.pet.size}`,
      `🛁 *Serviço:* ${appointment.service}`
    );

    if (appointment.service === 'Hospedagem') {
      lines.push(
        `📅 *Data de Entrada:* ${appointment.checkInDate || 'A combinar'}`,
        `⏰ *Horário de Entrada:* ${appointment.checkInTime || 'A combinar'}`,
        `📅 *Data de Saída:* ${appointment.checkOutDate || 'A combinar'}`,
        `⏰ *Horário de Saída:* ${appointment.checkOutTime || 'A combinar'}`
      );
    } else if (appointment.service === 'Creche') {
      lines.push(
        `🗓️ *Modalidade:* ${appointment.daycareFrequency || 'Dia avulso'}`,
        `📅 *Dias Desejados:* ${appointment.daycareDates?.join(', ') || appointment.date || 'A combinar'}`,
        `⏰ *Horário/Período:* ${appointment.daycarePeriod || 'Integral'} ${appointment.time ? `(${appointment.time})` : ''}`
      );
    } else {
      lines.push(
        `📅 *Data:* ${appointment.date || 'A combinar'}`,
        `⏰ *Horário:* ${appointment.time || 'A combinar'}`
      );
    }

    if (appointment.observations && appointment.observations.trim()) {
      lines.push(`📝 *Observações:* ${appointment.observations.trim()}`);
    } else {
      lines.push('📝 *Observações:* Nenhuma observação especial informada.');
    }

    lines.push('', 'Gostaria de solicitar este agendamento.');

    return lines.join('\n');
  }

  static getWhatsAppUrl(appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>, targetNumber = '5531993064841'): string {
    const text = this.generateWhatsAppMessage(appointment);
    return `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;
  }
}
