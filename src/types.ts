export type ServiceType = 
  | 'Banho' 
  | 'Tosa' 
  | 'Banho + Tosa' 
  | 'Creche' 
  | 'Hospedagem' 
  | 'Entrega' 
  | 'Outro';

export type PetSpecies = 'Cachorro' | 'Gato' | 'Outro';
export type PetSize = 'Pequeno' | 'Médio' | 'Grande';
export type PetGender = 'Macho' | 'Fêmea';
export type DaycarePeriod = 'Manhã' | 'Tarde' | 'Integral';
export type DaycareFrequency = 'Dia avulso' | 'Mais de um dia';

export type AppointmentStatus = 'pendente' | 'confirmado' | 'cancelado' | 'concluido';

export interface ClientData {
  name: string;
  whatsapp: string;
  email?: string;
}

export interface PetData {
  name: string;
  species: PetSpecies;
  breed: string;
  age: string;
  gender?: PetGender;
  size: PetSize;
}

export interface Appointment {
  id: string;
  service: ServiceType;
  client: ClientData;
  pet: PetData;
  // For standard appointments
  date?: string;
  time?: string;
  // For Hospedagem
  checkInDate?: string;
  checkOutDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  // For Creche
  daycareFrequency?: DaycareFrequency;
  daycareDates?: string[];
  daycarePeriod?: DaycarePeriod;
  // Observations
  observations?: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: ServiceType;
  description: string;
  buttonText: string;
  iconName: string;
  priceEstimate?: string;
  isActive: boolean;
}

export interface BusinessSettings {
  name: string;
  tagline: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  instagramHandle: string;
  openingHours: string;
  googleRating: number;
  googleReviewsCount: number;
  deliveryAvailable: boolean;
}

export interface BlockedTimeSlot {
  date: string;
  time: string;
  reason?: string;
}
