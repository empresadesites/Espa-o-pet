import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Clock3,
  Sun,
  Home,
  Settings as SettingsIcon,
  Sparkles,
  Scissors,
  Plus,
  Trash2,
  Edit2,
  Save,
  LogOut,
  Phone,
  Shield,
  Search,
  Filter,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import {
  Appointment,
  AppointmentStatus,
  BusinessSettings,
  ServiceItem,
  ServiceType,
  BlockedTimeSlot,
} from '../../types';
import { StorageService } from '../../services/storage';

interface AdminDashboardProps {
  onLogout: () => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onClose }) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'agendamentos' | 'servicos' | 'horarios' | 'hospedagem' | 'creche' | 'configuracoes'
  >('dashboard');

  // State loaded from StorageService
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(StorageService.getSettings());
  const [blockedSlots, setBlockedSlots] = useState<BlockedTimeSlot[]>([]);
  const [stats, setStats] = useState(StorageService.getStats());

  // Filter state for appointments
  const [appointmentFilter, setAppointmentFilter] = useState<'todos' | 'hoje' | 'pendente' | 'confirmado' | 'concluido' | 'cancelado'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Service Edit / Add modal state
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);

  // Time slot blocking tool
  const todayStr = new Date().toISOString().split('T')[0];
  const [blockDate, setBlockDate] = useState(todayStr);
  const [blockTime, setBlockTime] = useState('10:00');

  // Success notifications
  const [notification, setNotification] = useState('');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const loadData = () => {
    setAppointments(StorageService.getAppointments());
    setServices(StorageService.getServices());
    setSettings(StorageService.getSettings());
    setBlockedSlots(StorageService.getBlockedSlots());
    setStats(StorageService.getStats());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('espaco_pet_data_updated', handleUpdate);
    return () => window.removeEventListener('espaco_pet_data_updated', handleUpdate);
  }, []);

  // Status updates
  const handleUpdateStatus = (id: string, newStatus: AppointmentStatus) => {
    StorageService.updateAppointmentStatus(id, newStatus);
    loadData();
    showNotification(`Status do agendamento atualizado para "${newStatus}"!`);
  };

  const handleDeleteAppointment = (id: string) => {
    if (confirm('Tem certeza que deseja remover este agendamento?')) {
      StorageService.deleteAppointment(id);
      loadData();
      showNotification('Agendamento removido.');
    }
  };

  // Service operations
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    StorageService.saveService(editingService);
    setEditingService(null);
    setIsAddingService(false);
    loadData();
    showNotification('Serviço salvo com sucesso!');
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Deseja excluir este serviço?')) {
      StorageService.deleteService(id);
      loadData();
      showNotification('Serviço excluído.');
    }
  };

  // Slot blocking
  const handleToggleBlockSlot = () => {
    const isBlocked = StorageService.toggleBlockSlot(blockDate, blockTime);
    loadData();
    showNotification(
      isBlocked
        ? `Horário ${blockTime} em ${blockDate} bloqueado!`
        : `Horário ${blockTime} em ${blockDate} liberado!`
    );
  };

  // Settings save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(settings);
    loadData();
    showNotification('Configurações da empresa salvas com sucesso!');
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter((a) => {
    // Filter by status or date
    if (appointmentFilter === 'hoje' && a.date !== todayStr) return false;
    if (appointmentFilter !== 'todos' && appointmentFilter !== 'hoje' && a.status !== appointmentFilter) {
      return false;
    }
    // Search by client or pet
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const clientMatch = a.client.name.toLowerCase().includes(q) || a.client.whatsapp.includes(q);
      const petMatch = a.pet.name.toLowerCase().includes(q) || a.pet.breed.toLowerCase().includes(q);
      const serviceMatch = a.service.toLowerCase().includes(q);
      if (!clientMatch && !petMatch && !serviceMatch) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xl shadow-sm">
            🐾
          </div>
          <div>
            <h1 className="font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
              Espaço Pet Ipatinga <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">ADMIN</span>
            </h1>
            <p className="text-xs text-slate-400">
              Painel de Gestão e Agendamentos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Ver Site Público</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Floating Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-slate-950/60 border-b border-slate-800 px-4 sm:px-8 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-2 py-2 min-w-max">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
            { id: 'agendamentos', label: 'Agendamentos', icon: Calendar, badge: stats.pendingCount },
            { id: 'servicos', label: 'Serviços', icon: Scissors },
            { id: 'horarios', label: 'Horários & Bloqueios', icon: Clock },
            { id: 'hospedagem', label: 'Hospedagem', icon: Home, badge: stats.boardingCount },
            { id: 'creche', label: 'Creche', icon: Sun, badge: stats.daycareCount },
            { id: 'configuracoes', label: 'Configurações', icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Visão Geral do Estabelecimento</h2>
              <p className="text-xs text-slate-400 mt-1">Métricas operacionais atualizadas em tempo real</p>
            </div>

            {/* Dashboard Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Hoje</span>
                <p className="text-3xl font-extrabold text-white my-2">{stats.todayCount}</p>
                <span className="text-[11px] text-amber-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Agendamentos hoje
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Pendentes</span>
                <p className="text-3xl font-extrabold text-amber-400 my-2">{stats.pendingCount}</p>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock3 className="w-3 h-3 text-amber-400" /> Aguardando resposta
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Confirmados</span>
                <p className="text-3xl font-extrabold text-emerald-400 my-2">{stats.confirmedCount}</p>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" /> Aprovados
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Na Creche</span>
                <p className="text-3xl font-extrabold text-blue-400 my-2">{stats.daycareCount}</p>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Sun className="w-3 h-3 text-blue-400" /> Pets na recreação
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Hospedados</span>
                <p className="text-3xl font-extrabold text-purple-400 my-2">{stats.boardingCount}</p>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Home className="w-3 h-3 text-purple-400" /> Estadias ativas
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Clientes</span>
                <p className="text-3xl font-extrabold text-teal-400 my-2">{stats.totalClients}</p>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Users className="w-3 h-3 text-teal-400" /> Base de tutores
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Appointments Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Pending */}
              <div className="lg:col-span-8 bg-slate-800/50 rounded-2xl border border-slate-700 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Clock3 className="w-4 h-4 text-amber-400" />
                    Últimas Solicitações Recebidas
                  </h3>
                  <button
                    onClick={() => setActiveTab('agendamentos')}
                    className="text-xs text-amber-400 hover:underline font-bold"
                  >
                    Ver todas &rarr;
                  </button>
                </div>

                <div className="divide-y divide-slate-700/60">
                  {appointments.slice(0, 4).map((apt) => (
                    <div key={apt.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{apt.pet.name}</span>
                          <span className="text-xs text-slate-400">({apt.pet.species} • {apt.service})</span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            apt.status === 'confirmado' ? 'bg-emerald-500/20 text-emerald-400' :
                            apt.status === 'pendente' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-slate-700 text-slate-300'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Tutor: {apt.client.name} • WhatsApp: {apt.client.whatsapp}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`https://wa.me/${apt.client.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold"
                          title="Conversar no WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        {apt.status === 'pendente' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'confirmado')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                          >
                            Confirmar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status information */}
              <div className="lg:col-span-4 bg-slate-800/50 rounded-2xl border border-slate-700 p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Horário de Funcionamento
                </h3>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700">
                  <span className="text-xs text-slate-400 block mb-1">Status Configurado:</span>
                  <p className="text-emerald-400 font-extrabold text-sm">{settings.openingHours}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700">
                  <span className="text-xs text-slate-400 block mb-1">WhatsApp de Recebimento:</span>
                  <p className="text-white font-bold text-sm">+{settings.whatsapp}</p>
                  <span className="text-[11px] text-slate-400 mt-1 block">Telefone: {settings.phone}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700">
                  <span className="text-xs text-slate-400 block mb-1">Entrega / Leva e Traz:</span>
                  <p className="text-amber-400 font-bold text-sm">
                    {settings.deliveryAvailable ? 'Ativo e Informado no Site' : 'Desativado'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AGENDAMENTOS */}
        {activeTab === 'agendamentos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-white">Gestão de Agendamentos</h2>
                <p className="text-xs text-slate-400 mt-1">Visualize, confirme, cancele ou conclua os atendimentos</p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar tutor, pet ou serviço..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'hoje', label: 'Hoje' },
                { id: 'pendente', label: 'Pendentes' },
                { id: 'confirmado', label: 'Confirmados' },
                { id: 'concluido', label: 'Concluídos' },
                { id: 'cancelado', label: 'Cancelados' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setAppointmentFilter(f.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    appointmentFilter === f.id
                      ? 'bg-amber-500 text-slate-950 font-extrabold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Appointment Cards List */}
            {filteredAppointments.length === 0 ? (
              <div className="p-12 text-center bg-slate-800/40 rounded-2xl border border-slate-700">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 font-semibold text-sm">Nenhum agendamento encontrado para este filtro.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 flex flex-col justify-between space-y-4 shadow-sm"
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-extrabold text-xs">
                          {apt.service}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                              apt.status === 'confirmado' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              apt.status === 'pendente' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              apt.status === 'concluido' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>
                      </div>

                      {/* Pet & Owner Data */}
                      <div className="space-y-1.5">
                        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                          <span>🐾 {apt.pet.name}</span>
                          <span className="text-xs font-medium text-slate-400">
                            ({apt.pet.species} • {apt.pet.breed} • {apt.pet.size})
                          </span>
                        </h3>

                        <p className="text-xs text-slate-300">
                          <strong>Responsável:</strong> {apt.client.name}
                        </p>

                        <p className="text-xs text-slate-300 flex items-center gap-2">
                          <strong>WhatsApp:</strong> {apt.client.whatsapp}
                          <a
                            href={`https://wa.me/${apt.client.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-bold text-[11px]"
                          >
                            <Phone className="w-3 h-3" /> Chamar
                          </a>
                        </p>

                        {/* Scheduling detail */}
                        <div className="pt-2 text-xs text-amber-300">
                          {apt.service === 'Hospedagem' ? (
                            <p>
                              <strong>Estadia:</strong> {apt.checkInDate} ({apt.checkInTime}) até {apt.checkOutDate} ({apt.checkOutTime})
                            </p>
                          ) : apt.service === 'Creche' ? (
                            <p>
                              <strong>Creche:</strong> {apt.daycareFrequency} • {apt.daycarePeriod} • Dias: {apt.daycareDates?.join(', ') || apt.date}
                            </p>
                          ) : (
                            <p>
                              <strong>Data & Horário:</strong> {apt.date} às {apt.time}
                            </p>
                          )}
                        </div>

                        {/* Observations */}
                        {apt.observations && (
                          <div className="mt-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
                            <span className="font-bold text-amber-400 block mb-0.5">Observações do tutor:</span>
                            {apt.observations}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Action Buttons */}
                    <div className="pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {apt.status !== 'confirmado' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'confirmado')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                          >
                            Confirmar
                          </button>
                        )}
                        {apt.status !== 'concluido' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'concluido')}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                          >
                            Concluir
                          </button>
                        )}
                        {apt.status !== 'cancelado' && (
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'cancelado')}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteAppointment(apt.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remover agendamento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SERVIÇOS */}
        {activeTab === 'servicos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-white">Gerenciar Serviços</h2>
                <p className="text-xs text-slate-400 mt-1">Configure serviços, descrições, preços e visibilidade no site</p>
              </div>

              <button
                onClick={() => {
                  setEditingService({
                    id: `srv-${Date.now()}`,
                    title: '',
                    category: 'Banho',
                    description: '',
                    buttonText: 'AGENDAR',
                    iconName: 'Sparkles',
                    priceEstimate: 'Sob consulta',
                    isActive: true,
                  });
                  setIsAddingService(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Adicionar Serviço
              </button>
            </div>

            {/* Service Edit / Add Form Modal */}
            {(editingService || isAddingService) && editingService && (
              <div className="p-6 rounded-2xl bg-slate-800 border-2 border-amber-500 space-y-4">
                <h3 className="font-bold text-white text-base">
                  {isAddingService ? 'Novo Serviço' : 'Editar Serviço'}
                </h3>
                <form onSubmit={handleSaveService} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 font-bold mb-1">Título do Serviço</label>
                    <input
                      type="text"
                      required
                      value={editingService.title}
                      onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-bold mb-1">Categoria Principal</label>
                    <select
                      value={editingService.category}
                      onChange={(e) => setEditingService({ ...editingService, category: e.target.value as ServiceType })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                    >
                      <option value="Banho">Banho</option>
                      <option value="Tosa">Tosa</option>
                      <option value="Banho + Tosa">Banho + Tosa</option>
                      <option value="Creche">Creche</option>
                      <option value="Hospedagem">Hospedagem</option>
                      <option value="Entrega">Entrega / Leva e Traz</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-300 font-bold mb-1">Descrição Comercial</label>
                    <textarea
                      rows={2}
                      required
                      value={editingService.description}
                      onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-bold mb-1">Texto do Botão</label>
                    <input
                      type="text"
                      required
                      value={editingService.buttonText}
                      onChange={(e) => setEditingService({ ...editingService, buttonText: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-bold mb-1">Preço / Estimativa</label>
                    <input
                      type="text"
                      value={editingService.priceEstimate || ''}
                      onChange={(e) => setEditingService({ ...editingService, priceEstimate: e.target.value })}
                      placeholder="Ex: A partir de R$ 50,00"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="service-active-check"
                      checked={editingService.isActive}
                      onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4"
                    />
                    <label htmlFor="service-active-check" className="text-xs font-bold text-white">
                      Serviço ativo no site
                    </label>
                  </div>

                  <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingService(null);
                        setIsAddingService(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      Salvar Serviço
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Services List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    srv.isActive ? 'bg-slate-800 border-slate-700' : 'bg-slate-900/50 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      {srv.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${srv.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                      {srv.isActive ? 'Ativo' : 'Oculto'}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white">{srv.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{srv.description}</p>
                  
                  {srv.priceEstimate && (
                    <p className="text-xs text-amber-300 font-semibold mt-2">{srv.priceEstimate}</p>
                  )}

                  <div className="pt-4 mt-3 border-t border-slate-700/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">{srv.buttonText}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingService(srv);
                          setIsAddingService(false);
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(srv.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HORÁRIOS & BLOQUEIOS */}
        {activeTab === 'horarios' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Disponibilidade & Bloqueio de Horários</h2>
              <p className="text-xs text-slate-400 mt-1">
                Bloqueie horários em datas específicas para evitar agendamentos em horários lotados ou feriados
              </p>
            </div>

            {/* Blocking Tool Card */}
            <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 space-y-4 max-w-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Alternar Bloqueio de Horário
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-bold mb-1">Data</label>
                  <input
                    type="date"
                    min={todayStr}
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-bold mb-1">Horário</label>
                  <select
                    value={blockTime}
                    onChange={(e) => setBlockTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                  >
                    {[
                      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
                      '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
                      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
                    ].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleToggleBlockSlot}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Bloquear / Desbloquear este Horário
              </button>
            </div>

            {/* List of currently blocked slots */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Horários Atualmente Bloqueados ({blockedSlots.length})
              </h3>
              {blockedSlots.length === 0 ? (
                <p className="text-xs text-slate-500">Nenhum horário bloqueado manualmente.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {blockedSlots.map((b) => (
                    <div
                      key={`${b.date}-${b.time}`}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2"
                    >
                      <span>{b.date} às {b.time}</span>
                      <button
                        onClick={() => StorageService.toggleBlockSlot(b.date, b.time)}
                        className="hover:text-white"
                        title="Desbloquear"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: HOSPEDAGEM */}
        {activeTab === 'hospedagem' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Módulo de Hospedagem</h2>
              <p className="text-xs text-slate-400 mt-1">Acompanhe entradas, saídas, hóspedes ativos e cuidados especiais</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {appointments
                .filter((a) => a.service === 'Hospedagem')
                .map((apt) => (
                  <div
                    key={apt.id}
                    className="p-5 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🏠</span>
                        <h3 className="font-extrabold text-white text-base">{apt.pet.name}</h3>
                        <span className="text-xs text-slate-400">({apt.pet.species} • {apt.pet.breed} • {apt.pet.size})</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          apt.status === 'confirmado' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        <strong>Tutor:</strong> {apt.client.name} • <strong>WhatsApp:</strong> {apt.client.whatsapp}
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-amber-300 pt-1">
                        <span>📅 <strong>Entrada:</strong> {apt.checkInDate} às {apt.checkInTime}</span>
                        <span>📅 <strong>Saída:</strong> {apt.checkOutDate} às {apt.checkOutTime}</span>
                      </div>
                      {apt.observations && (
                        <p className="text-xs text-slate-400 italic mt-1">
                          Observação: "{apt.observations}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${apt.client.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 6: CRECHE */}
        {activeTab === 'creche' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Módulo da Creche & Recreação</h2>
              <p className="text-xs text-slate-400 mt-1">Controle de frequência, turmas e períodos de recreação canina</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {appointments
                .filter((a) => a.service === 'Creche')
                .map((apt) => (
                  <div
                    key={apt.id}
                    className="p-5 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎾</span>
                        <h3 className="font-extrabold text-white text-base">{apt.pet.name}</h3>
                        <span className="text-xs text-slate-400">({apt.pet.species} • {apt.pet.breed} • {apt.pet.size})</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          apt.status === 'confirmado' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        <strong>Tutor:</strong> {apt.client.name} • <strong>WhatsApp:</strong> {apt.client.whatsapp}
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-amber-300 pt-1">
                        <span>🗓️ <strong>Modalidade:</strong> {apt.daycareFrequency || 'Dia avulso'}</span>
                        <span>⏰ <strong>Período:</strong> {apt.daycarePeriod || 'Integral'}</span>
                        <span>📅 <strong>Dias:</strong> {apt.daycareDates?.join(', ') || apt.date}</span>
                      </div>
                      {apt.observations && (
                        <p className="text-xs text-slate-400 italic mt-1">
                          Observação: "{apt.observations}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${apt.client.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 7: CONFIGURAÇÕES GERAIS */}
        {activeTab === 'configuracoes' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Configurações do Espaço Pet</h2>
              <p className="text-xs text-slate-400 mt-1">Atualize informações de contato, horários e endereço refletidos no site</p>
            </div>

            <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-slate-800 border border-slate-700 space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Nome do Estabelecimento</label>
                <input
                  type="text"
                  required
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-bold mb-1">Telefone de Apresentação</label>
                  <input
                    type="text"
                    required
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-bold mb-1">Número WhatsApp (com código do país)</label>
                  <input
                    type="text"
                    required
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Horário de Funcionamento Exibido</label>
                <input
                  type="text"
                  required
                  value={settings.openingHours}
                  onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
                <p className="text-[11px] text-slate-400 mt-1">Ex: Aberto — fecha às 19:30</p>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Link do Instagram</label>
                <input
                  type="url"
                  required
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-bold mb-1">Endereço</label>
                  <input
                    type="text"
                    required
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-bold mb-1">Bairro</label>
                  <input
                    type="text"
                    required
                    value={settings.neighborhood}
                    onChange={(e) => setSettings({ ...settings, neighborhood: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="settings-delivery-check"
                  checked={settings.deliveryAvailable}
                  onChange={(e) => setSettings({ ...settings, deliveryAvailable: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4"
                />
                <label htmlFor="settings-delivery-check" className="text-xs font-bold text-white">
                  Informar serviço de entrega / Leva e Traz disponível no site
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

    </div>
  );
};
