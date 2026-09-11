import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Bath,
  Scissors,
  Sun,
  Home,
  ShieldCheck,
} from 'lucide-react';
import {
  ServiceType,
  PetSpecies,
  PetSize,
  PetGender,
  DaycareFrequency,
  DaycarePeriod,
  Appointment,
} from '../types';
import { StorageService } from '../services/storage';

interface BookingProps {
  initialService?: ServiceType;
  onBookingSuccess?: (appointment: Appointment) => void;
}

export const Booking: React.FC<BookingProps> = ({
  initialService = 'Banho + Tosa',
  onBookingSuccess,
}) => {
  // Service selection
  const [service, setService] = useState<ServiceType>(initialService);

  // Client Data
  const [clientName, setClientName] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  // Pet Data
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('Cachorro');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<PetGender>('Macho');
  const [size, setSize] = useState<PetSize>('Pequeno');

  // Dates & Times - General
  const todayFormatted = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayFormatted);
  const [time, setTime] = useState('09:00');

  // Hospedagem Specifics
  const [checkInDate, setCheckInDate] = useState(todayFormatted);
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('08:00');
  const [checkOutTime, setCheckOutTime] = useState('17:00');

  // Creche Specifics
  const [daycareFrequency, setDaycareFrequency] = useState<DaycareFrequency>('Dia avulso');
  const [daycareDatesText, setDaycareDatesText] = useState(todayFormatted);
  const [daycarePeriod, setDaycarePeriod] = useState<DaycarePeriod>('Integral');

  // Observations
  const [observations, setObservations] = useState('');

  // Step handling
  // Step 1: Form details, Step 2: Summary ("Confira seus dados 🐾"), Step 3: Success Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Sync initialService if parent changes it
  useEffect(() => {
    if (initialService) {
      setService(initialService);
    }
  }, [initialService]);

  // Standard Available Time Slots
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const validateStep1 = (): boolean => {
    setErrorMsg('');
    if (!clientName.trim()) {
      setErrorMsg('Por favor, informe o nome do responsável.');
      return false;
    }
    if (!clientWhatsapp.trim() || clientWhatsapp.replace(/\D/g, '').length < 9) {
      setErrorMsg('Por favor, informe um número de WhatsApp válido.');
      return false;
    }
    if (!petName.trim()) {
      setErrorMsg('Por favor, informe o nome do seu pet.');
      return false;
    }

    // Specific validation based on service
    if (service === 'Hospedagem') {
      if (!checkInDate || !checkOutDate) {
        setErrorMsg('Por favor, selecione as datas de entrada e saída da hospedagem.');
        return false;
      }
      if (checkOutDate < checkInDate) {
        setErrorMsg('A data de saída não pode ser anterior à data de entrada.');
        return false;
      }
    } else if (service === 'Creche') {
      if (!daycareDatesText.trim()) {
        setErrorMsg('Por favor, indique o(s) dia(s) desejado(s) para a creche.');
        return false;
      }
    } else {
      if (!date) {
        setErrorMsg('Por favor, selecione a data desejada.');
        return false;
      }
      // Check if slot is occupied
      if (StorageService.isSlotOccupied(date, time)) {
        setErrorMsg(`O horário ${time} do dia ${date} já está reservado ou bloqueado. Por favor, escolha outro horário.`);
        return false;
      }
    }

    return true;
  };

  const handleProceedToSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      // scroll smoothly to summary container
      const el = document.getElementById('agendamento');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConfirmAndSendWhatsApp = () => {
    const daycareDatesArray = daycareDatesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const appointmentPayload = {
      service,
      client: {
        name: clientName.trim(),
        whatsapp: clientWhatsapp.trim(),
        email: clientEmail.trim() || undefined,
      },
      pet: {
        name: petName.trim(),
        species,
        breed: breed.trim() || 'Não informada',
        age: age.trim() || 'Não informada',
        gender,
        size,
      },
      date: service === 'Hospedagem' ? checkInDate : date,
      time: service === 'Hospedagem' ? checkInTime : time,
      checkInDate: service === 'Hospedagem' ? checkInDate : undefined,
      checkOutDate: service === 'Hospedagem' ? checkOutDate : undefined,
      checkInTime: service === 'Hospedagem' ? checkInTime : undefined,
      checkOutTime: service === 'Hospedagem' ? checkOutTime : undefined,
      daycareFrequency: service === 'Creche' ? daycareFrequency : undefined,
      daycareDates: service === 'Creche' ? daycareDatesArray : undefined,
      daycarePeriod: service === 'Creche' ? daycarePeriod : undefined,
      observations: observations.trim() || undefined,
    };

    // 1. Save to local repository / database
    const saved = StorageService.addAppointment(appointmentPayload);
    setCreatedAppointment(saved);

    if (onBookingSuccess) {
      onBookingSuccess(saved);
    }

    // 2. Generate WhatsApp link and open
    const targetWhatsapp = '5531993064841';
    const whatsappUrl = StorageService.getWhatsAppUrl(appointmentPayload, targetWhatsapp);

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // 3. Move to success view
    setStep(3);
  };

  const resetForm = () => {
    setClientName('');
    setClientWhatsapp('');
    setClientEmail('');
    setPetName('');
    setBreed('');
    setAge('');
    setObservations('');
    setStep(1);
    setCreatedAppointment(null);
  };

  return (
    <section id="agendamento" className="py-20 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <span>🐾</span> Agendamento Online
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
            Solicite o atendimento do seu pet
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Preencha os dados abaixo. Após a confirmação, todas as informações são enviadas automaticamente para o WhatsApp do Espaço Pet Ipatinga.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${step >= 1 ? 'text-amber-600' : 'text-slate-400'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs text-white ${step >= 1 ? 'bg-amber-600' : 'bg-slate-300'}`}>
              1
            </span>
            <span>Preenchimento</span>
          </div>

          <div className={`w-10 h-0.5 ${step >= 2 ? 'bg-amber-600' : 'bg-slate-200'}`} />

          <div className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${step >= 2 ? 'text-amber-600' : 'text-slate-400'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs text-white ${step >= 2 ? 'bg-amber-600' : 'bg-slate-300'}`}>
              2
            </span>
            <span>Confira seus Dados</span>
          </div>

          <div className={`w-10 h-0.5 ${step >= 3 ? 'bg-amber-600' : 'bg-slate-200'}`} />

          <div className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${step === 3 ? 'text-emerald-600' : 'text-slate-400'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs text-white ${step === 3 ? 'bg-emerald-600' : 'bg-slate-300'}`}>
              3
            </span>
            <span>Pronto</span>
          </div>
        </div>

        {/* STEP 1: FORM */}
        {step === 1 && (
          <form
            onSubmit={handleProceedToSummary}
            className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-amber-100 shadow-sm space-y-8"
          >
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Escolha do Serviço */}
            <div>
              <label className="block text-sm font-extrabold text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                1. Escolha o Serviço
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Banho', desc: 'Higiene & cheirinho' },
                  { label: 'Tosa', desc: 'Estética com tesoura/máquina' },
                  { label: 'Banho + Tosa', desc: 'Completo e relaxante' },
                  { label: 'Creche', desc: 'Recreação & socialização' },
                  { label: 'Hospedagem', desc: 'Estadia com pernoite' },
                  { label: 'Outro', desc: 'Necessidade personalizada' },
                ].map((s) => (
                  <button
                    type="button"
                    key={s.label}
                    onClick={() => setService(s.label as ServiceType)}
                    className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                      service === s.label
                        ? 'border-amber-500 bg-amber-50/80 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    <p className="font-bold text-slate-900 text-sm">{s.label}</p>
                    <p className="text-[11px] text-slate-500">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Dados do Responsável */}
            <div>
              <label className="block text-sm font-extrabold text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-amber-500" />
                2. Dados do Responsável
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mariana Silva"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp (com DDD) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: (31) 99999-9999"
                    value={clientWhatsapp}
                    onChange={(e) => setClientWhatsapp(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail (opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="Ex: seuemail@exemplo.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 3. Dados do Pet */}
            <div>
              <label className="block text-sm font-extrabold text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <span className="text-base">🐶</span>
                3. Dados do Pet
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome do Pet *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Nino"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Espécie *
                  </label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as PetSpecies)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  >
                    <option value="Cachorro">🐶 Cachorro</option>
                    <option value="Gato">🐱 Gato</option>
                    <option value="Outro">🐾 Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Raça
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Shih Tzu, SRD, Golden..."
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Idade
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 2 anos, 6 meses..."
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sexo
                  </label>
                  <div className="flex gap-2">
                    {(['Macho', 'Fêmea'] as PetGender[]).map((g) => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setGender(g)}
                        className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          gender === g
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Porte *
                  </label>
                  <div className="flex gap-2">
                    {(['Pequeno', 'Médio', 'Grande'] as PetSize[]).map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSize(s)}
                        className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          size === s
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. DYNAMIC ADAPTATION: HOSPEDAGEM */}
            {service === 'Hospedagem' && (
              <div className="p-5 rounded-2xl bg-amber-100/50 border border-amber-200 space-y-4">
                <label className="block text-sm font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-2">
                  <Home className="w-4 h-4 text-amber-700" />
                  4. Período de Hospedagem
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Data de Entrada *
                    </label>
                    <input
                      type="date"
                      required
                      min={todayFormatted}
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Horário de Entrada
                    </label>
                    <select
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:ring-2 focus:ring-amber-500 text-sm"
                    >
                      {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Data de Saída *
                    </label>
                    <input
                      type="date"
                      required
                      min={checkInDate || todayFormatted}
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Horário de Saída
                    </label>
                    <select
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:ring-2 focus:ring-amber-500 text-sm"
                    >
                      {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 4. DYNAMIC ADAPTATION: CRECHE */}
            {service === 'Creche' && (
              <div className="p-5 rounded-2xl bg-amber-100/50 border border-amber-200 space-y-4">
                <label className="block text-sm font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-700" />
                  4. Detalhes da Creche
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Modalidade Desejada
                    </label>
                    <div className="flex gap-2">
                      {(['Dia avulso', 'Mais de um dia'] as DaycareFrequency[]).map((f) => (
                        <button
                          type="button"
                          key={f}
                          onClick={() => setDaycareFrequency(f)}
                          className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            daycareFrequency === f
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Período
                    </label>
                    <div className="flex gap-2">
                      {(['Manhã', 'Tarde', 'Integral'] as DaycarePeriod[]).map((p) => (
                        <button
                          type="button"
                          key={p}
                          onClick={() => setDaycarePeriod(p)}
                          className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            daycarePeriod === p
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Dia(s) Desejado(s) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Toda segunda e quarta, ou 12/09/2026..."
                      value={daycareDatesText}
                      onChange={(e) => setDaycareDatesText(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. DYNAMIC ADAPTATION: STANDARD (Banho, Tosa, Banho + Tosa, Outro) */}
            {service !== 'Hospedagem' && service !== 'Creche' && (
              <div>
                <label className="block text-sm font-extrabold text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-amber-500" />
                  4. Data e Horário Desejados
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Data Preferencial *
                    </label>
                    <input
                      type="date"
                      required
                      min={todayFormatted}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Horário Disponível *
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                    >
                      {timeSlots.map((slot) => {
                        const occupied = StorageService.isSlotOccupied(date, slot);
                        return (
                          <option key={slot} value={slot} disabled={occupied}>
                            {slot} {occupied ? '(Indisponível)' : '— Disponível'}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Observações Importantes */}
            <div>
              <label className="block text-sm font-extrabold text-slate-900 mb-1 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                5. Existe alguma informação importante sobre seu pet?
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Exemplos: Medo de secador, agressividade, necessidade especial, alergia, medicação, comportamento, etc.
              </p>

              <textarea
                rows={3}
                placeholder="Conte para a gente para podermos preparar o melhor acolhimento..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="btn-prosseguir-resumo"
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-base tracking-wide shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>CONFERIR RESUMO E AVANÇAR</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </form>
        )}

        {/* STEP 2: SUMMARY SCREEN ("Confira seus dados 🐾") */}
        {step === 2 && (
          <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-amber-200 shadow-lg space-y-6 animate-in fade-in duration-300">
            
            <div className="text-center pb-4 border-b border-amber-200">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display flex items-center justify-center gap-2">
                Confira seus dados <span className="text-amber-600">🐾</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Revise as informações antes de confirmar o envio direto para o WhatsApp do Espaço Pet Ipatinga.
              </p>
            </div>

            {/* Summary Details Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Responsável
                  </span>
                  <p className="font-bold text-slate-900 text-base">{clientName}</p>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    WhatsApp
                  </span>
                  <p className="font-bold text-emerald-700 text-base">{clientWhatsapp}</p>
                </div>

                {clientEmail && (
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      E-mail
                    </span>
                    <p className="text-slate-800">{clientEmail}</p>
                  </div>
                )}

                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Pet
                  </span>
                  <p className="font-bold text-slate-900 text-base">
                    {petName} <span className="text-xs text-slate-500">({species})</span>
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Raça & Idade
                  </span>
                  <p className="text-slate-800">
                    {breed || 'Não informada'} • {age || 'Não informada'}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Porte & Sexo
                  </span>
                  <p className="text-slate-800">
                    {size} • {gender}
                  </p>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                    Serviço Solicitado
                  </span>
                  <p className="font-extrabold text-amber-700 text-lg">{service}</p>
                </div>

                {service === 'Hospedagem' ? (
                  <>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Entrada
                      </span>
                      <p className="font-bold text-slate-900">{checkInDate} às {checkInTime}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Saída
                      </span>
                      <p className="font-bold text-slate-900">{checkOutDate} às {checkOutTime}</p>
                    </div>
                  </>
                ) : service === 'Creche' ? (
                  <>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Modalidade & Período
                      </span>
                      <p className="font-bold text-slate-900">{daycareFrequency} — {daycarePeriod}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Dias Desejados
                      </span>
                      <p className="font-bold text-slate-900">{daycareDatesText}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Data
                      </span>
                      <p className="font-bold text-slate-900">{date}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Horário
                      </span>
                      <p className="font-bold text-slate-900">{time}</p>
                    </div>
                  </>
                )}

                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Observações
                  </span>
                  <p className="text-slate-700 italic">
                    {observations.trim() ? observations : 'Nenhuma observação especial informada.'}
                  </p>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="order-2 sm:order-1 px-6 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                CORRIGIR DADOS
              </button>

              <button
                type="button"
                id="btn-confirmar-pelo-whatsapp"
                onClick={handleConfirmAndSendWhatsApp}
                className="order-1 sm:order-2 flex-1 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base tracking-wide shadow-lg shadow-emerald-600/30 hover:shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>CONFIRMAR PELO WHATSAPP</span>
                <span className="text-xl">💬</span>
              </button>
            </div>

            <p className="text-center text-xs text-slate-500">
              Ao clicar no botão acima, seu aplicativo do WhatsApp abrirá com todos os dados montados para envio ao número <strong>(31) 99306-4841</strong>.
            </p>

          </div>
        )}

        {/* STEP 3: SUCCESS & REDIRECT SCREEN */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
              🐾
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Solicitação Registrada com Sucesso!
            </h3>

            <p className="text-slate-600 text-base max-w-lg mx-auto leading-relaxed">
              O agendamento do(a) <strong>{petName}</strong> foi registrado em nosso sistema e a janela do WhatsApp foi iniciada. Caso a conversa não tenha aberto automaticamente, clique no botão abaixo:
            </p>

            <div className="pt-2">
              <a
                href={
                  createdAppointment
                    ? StorageService.getWhatsAppUrl(createdAppointment, '5531993064841')
                    : `https://wa.me/5531993064841`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                ABRIR CONVERSA NO WHATSAPP
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                onClick={resetForm}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 underline transition-colors cursor-pointer"
              >
                Fazer outro agendamento
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
