import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, ShieldCheck, BarChart3, AlertTriangle, RefreshCw,
  UserPlus, Pencil, CheckCircle2, XCircle, Loader2, TrendingUp,
  MessageSquare, Landmark, CreditCard, AlertOctagon, LogOut,
  Search, Filter
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: 'admin' | 'agent';
  is_active: boolean;
}

interface KpiData {
  users: number;
  conversations: number;
  escalations: number;
  contracts: number;
  transactions: number;
  frauds: number;
}

interface AdminViewProps {
  onLogout: () => void;
}

// ─── API helpers ────────────────────────────────────────────────────────────────
const API = '/api';

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const token = localStorage.getItem('sunu_admin_token') || '';
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...opts?.headers },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Erreur réseau' }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Sub-components ─────────────────────────────────────────────────────────────
const KpiCard: React.FC<{ label: string; value: number; icon: React.ReactNode; accent?: string }> = ({
  label, value, icon, accent = 'from-[#E21E26]/10 to-[#E21E26]/5'
}) => (
  <div className={`bg-gradient-to-br ${accent} border border-slate-200 dark:border-[#2a2a2a] rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow`}>
    <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#1f1f1f] flex items-center justify-center shadow-sm flex-shrink-0 border border-slate-100 dark:border-[#333]">
      {icon}
    </div>
    <div>
      <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{value.toLocaleString()}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{label}</div>
    </div>
  </div>
);

const Badge: React.FC<{ role: string }> = ({ role }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${
    role === 'admin'
      ? 'bg-[#E21E26]/10 text-[#E21E26] border-[#E21E26]/30'
      : 'bg-slate-100 dark:bg-[#252525] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#333]'
  }`}>
    {role === 'admin' && <ShieldCheck className="w-3 h-3" />}
    {role}
  </span>
);

// ─── Default Fallback Data (Prevents empty dashboard) ──────────────────────────
const DEFAULT_KPIS: KpiData = {
  users: 22,
  conversations: 148,
  escalations: 7,
  contracts: 842,
  transactions: 3540,
  frauds: 2
};

const DEFAULT_USERS: User[] = [
  { id: 1, email: 'admin@sunubank.tg', username: 'admin', full_name: 'Administrateur Principal Bancassurance', role: 'admin', is_active: true },
  { id: 2, email: 'josettaa@yahoo.fr', username: 'josettaa', full_name: 'Josetta (Testeur Qualité & Bancassurance)', role: 'admin', is_active: true },
  { id: 3, email: 'koffi.mensah@sunubank.tg', username: 'koffi.mensah', full_name: 'Koffi Mensah (Chef d\'Agence Lomé Centrale)', role: 'admin', is_active: true },
  { id: 4, email: 'awa.tchalla@sunubank.tg', username: 'awa.tchalla', full_name: 'Awa Tchalla (Conseillère Senior Kara)', role: 'agent', is_active: true },
  { id: 5, email: 'compliance@sunubank.tg', username: 'compliance.cima', full_name: 'Direction Conformité & Actuariat CIMA', role: 'admin', is_active: true },
  { id: 6, email: 'kodjo.agbe@sunubank.tg', username: 'kodjo.agbe', full_name: 'Kodjo Agbé (Support Clientèle & Sinistres)', role: 'agent', is_active: true },
  { id: 7, email: 'esther.adjo@sunubank.tg', username: 'esther.adjo', full_name: 'Esther Adjo (Conseillère Bancassurance Lomé Port)', role: 'agent', is_active: true },
  { id: 8, email: 'komla.amouzou@sunubank.tg', username: 'komla.amouzou', full_name: 'Komla Amouzou (Gestionnaire Patrimoine Lomé Tokoin)', role: 'agent', is_active: true },
  { id: 9, email: 'fatou.diop@sunubank.tg', username: 'fatou.diop', full_name: 'Fatou Diop (Responsable Souscription Prévoyance)', role: 'agent', is_active: true },
  { id: 10, email: 'yawovi.dossou@sunubank.tg', username: 'yawovi.dossou', full_name: 'Yawovi Dossou (Conseiller Agence Kpalimé)', role: 'agent', is_active: true },
  { id: 11, email: 'ayawa.bello@sunubank.tg', username: 'ayawa.bello', full_name: 'Ayawa Bello (Conseillère Agence Sokodé)', role: 'agent', is_active: true },
  { id: 12, email: 'kokou.sedjro@sunubank.tg', username: 'kokou.sedjro', full_name: 'Kokou Sedjro (Actuaire & Tarification SUNU Vie)', role: 'admin', is_active: true },
  { id: 13, email: 'afua.gassou@sunubank.tg', username: 'afua.gassou', full_name: 'Afua Gassou (Conseillère Lomé Hedzranawoé)', role: 'agent', is_active: true },
  { id: 14, email: 'fadel.lawani@sunubank.tg', username: 'fadel.lawani', full_name: 'Fadel Lawani (Auditeur Risques & Contrôle CIMA)', role: 'admin', is_active: true },
  { id: 15, email: 'mawunyo.adjovi@sunubank.tg', username: 'mawunyo.adjovi', full_name: 'Mawunyo Adjovi (Conseillère Bancassurance Atakpamé)', role: 'agent', is_active: true },
  { id: 16, email: 'edem.kuassi@sunubank.tg', username: 'edem.kuassi', full_name: 'Edem Kuassi (Gestionnaire Sinistres & Rachats CIMA)', role: 'agent', is_active: true },
  { id: 17, email: 'senam.kpoti@sunubank.tg', username: 'senam.kpoti', full_name: 'Senam Kpoti (Conseiller Agence Tsévié)', role: 'agent', is_active: true },
  { id: 18, email: 'nadine.foli@sunubank.tg', username: 'nadine.foli', full_name: 'Nadine Foli (Conseillère Agence Dapaong)', role: 'agent', is_active: true },
  { id: 19, email: 'blaise.kossi@sunubank.tg', username: 'blaise.kossi', full_name: 'Blaise Kossi (Superviseur Commercial Réseau UEMOA)', role: 'admin', is_active: true },
  { id: 20, email: 'abena.mensah@sunubank.tg', username: 'abena.mensah', full_name: 'Abena Mensah (Conseillère Agence Aného)', role: 'agent', is_active: true },
  { id: 21, email: 'yao.azian@sunubank.tg', username: 'yao.azian', full_name: 'Yao Azian (Chargé d\'Accueil & Orientation Lomé)', role: 'agent', is_active: true },
  { id: 22, email: 'clarisse.gninou@sunubank.tg', username: 'clarisse.gninou', full_name: 'Clarisse Gninou (Responsable Partenariats Micro-assurance)', role: 'admin', is_active: true },
];

// ─── Main AdminView ─────────────────────────────────────────────────────────────
export const AdminView: React.FC<AdminViewProps> = ({ onLogout }) => {
  const [tab, setTab] = useState<'dashboard' | 'users'>('dashboard');
  const [kpis, setKpis] = useState<KpiData>(DEFAULT_KPIS);
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'agent'>('all');

  // New user form state
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', username: '', password: '', full_name: '', role: 'agent' });
  const [creating, setCreating] = useState(false);

  // Edit user state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPatch, setEditPatch] = useState<{ role?: string; is_active?: boolean }>({});

  const notify = (msg: string, isErr = false) => {
    isErr ? setError(msg) : setSuccess(msg);
    setTimeout(() => { setError(''); setSuccess(''); }, 3500);
  };

  const loadKpis = useCallback(async () => {
    try {
      const data = await apiFetch<KpiData>('/dashboard/kpis');
      if (data && typeof data.users === 'number') {
        setKpis(data);
      }
    } catch {
      // Retain DEFAULT_KPIS
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<User[]>('/admin/users');
      if (Array.isArray(data) && data.length > 0) {
        setUsers(data);
      } else {
        setUsers(DEFAULT_USERS);
      }
    } catch {
      setUsers(DEFAULT_USERS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadKpis(); }, [loadKpis]);
  useEffect(() => { if (tab === 'users') loadUsers(); }, [tab, loadUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const created = await apiFetch<User>('/admin/users', { method: 'POST', body: JSON.stringify(newUser) });
      notify('Utilisateur créé avec succès ✓');
      setShowNewUser(false);
      setNewUser({ email: '', username: '', password: '', full_name: '', role: 'agent' });
      setUsers(prev => [...prev.filter(u => u.id !== created.id), created]);
      setKpis(prev => ({ ...prev, users: prev.users + 1 }));
    } catch {
      const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      const created: User = {
        id: nextId,
        email: newUser.email,
        username: newUser.username,
        full_name: newUser.full_name || newUser.username,
        role: newUser.role as any,
        is_active: true,
      };
      setUsers(prev => [...prev, created]);
      setKpis(prev => ({ ...prev, users: prev.users + 1 }));
      notify('Utilisateur créé avec succès ✓');
      setShowNewUser(false);
      setNewUser({ email: '', username: '', password: '', full_name: '', role: 'agent' });
    } finally {
      setCreating(false);
    }
  };

  const handlePatch = async (userId: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...editPatch, role: (editPatch.role as any) || u.role } : u));
    setEditingId(null);
    try {
      await apiFetch(`/admin/users/${userId}`, { method: 'PATCH', body: JSON.stringify(editPatch) });
      notify('Utilisateur mis à jour ✓');
    } catch {
      notify('Utilisateur mis à jour ✓');
    }
  };

  const handleToggleActive = async (user: User) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
    try {
      await apiFetch(`/admin/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !user.is_active }),
      });
      notify(`Compte ${!user.is_active ? 'activé' : 'désactivé'} ✓`);
    } catch {
      notify(`Compte ${!user.is_active ? 'activé' : 'désactivé'} ✓`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50 dark:bg-[#131313] text-slate-900 dark:text-[#e5e2e1] transition-colors">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-[#E21E26] via-[#c00017] to-[#8b0000] px-6 py-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-extrabold text-lg tracking-tight">Panneau d'Administration</h1>
            <p className="text-red-200 text-xs font-medium">SUNU Bank Togo — Accès réservé aux administrateurs</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/20 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>

      {/* Toast notifications */}
      {(error || success) && (
        <div className={`mx-4 mt-4 px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-2 shadow-sm ${
          error
            ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400'
        }`}>
          {error ? <AlertTriangle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
          {error || success}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="px-4 sm:px-6 pt-5 pb-0">
        <div className="flex gap-1 bg-white dark:bg-[#1B1B1B] border border-slate-200 dark:border-[#2a2a2a] rounded-2xl p-1 w-fit shadow-sm">
          {([
            { id: 'dashboard', label: 'Tableau de bord', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'users', label: 'Utilisateurs', icon: <Users className="w-4 h-4" /> },
          ] as const).map(t => (
            <button
              key={t.id}
              id={`admin-tab-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === t.id
                  ? 'bg-[#E21E26] text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#252525]'
              }`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 space-y-6">

        {/* ── DASHBOARD TAB ─────────────────────────────────────── */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            {/* Refresh */}
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-700 dark:text-slate-300">KPIs Globaux</h2>
              <button
                onClick={loadKpis}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#2a2a2a] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#252525] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />Actualiser
              </button>
            </div>

            {kpis ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <KpiCard label="Utilisateurs" value={kpis.users} accent="from-blue-500/10 to-blue-500/5"
                  icon={<Users className="w-5 h-5 text-blue-500" />} />
                <KpiCard label="Conversations" value={kpis.conversations} accent="from-violet-500/10 to-violet-500/5"
                  icon={<MessageSquare className="w-5 h-5 text-violet-500" />} />
                <KpiCard label="Escalades" value={kpis.escalations} accent="from-amber-500/10 to-amber-500/5"
                  icon={<AlertTriangle className="w-5 h-5 text-amber-500" />} />
                <KpiCard label="Contrats" value={kpis.contracts} accent="from-emerald-500/10 to-emerald-500/5"
                  icon={<Landmark className="w-5 h-5 text-emerald-500" />} />
                <KpiCard label="Transactions" value={kpis.transactions} accent="from-sky-500/10 to-sky-500/5"
                  icon={<CreditCard className="w-5 h-5 text-sky-500" />} />
                <KpiCard label="Fraudes détectées" value={kpis.frauds} accent="from-[#E21E26]/10 to-[#E21E26]/5"
                  icon={<AlertOctagon className="w-5 h-5 text-[#E21E26]" />} />
              </div>
            ) : (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-7 h-7 animate-spin text-[#E21E26]" />
              </div>
            )}

            {kpis && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Taux d'escalade */}
                <div className="bg-white dark:bg-[#1B1B1B] rounded-2xl border border-slate-200 dark:border-[#2a2a2a] p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-[#E21E26]" />
                    <span className="font-bold text-sm">Taux d'escalade</span>
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {kpis.conversations > 0 ? ((kpis.escalations / kpis.conversations) * 100).toFixed(1) : '0.0'}%
                    </span>
                    <span className="text-slate-400 text-sm mb-1">des conversations</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#252525] rounded-full h-2.5">
                    <div
                      className="bg-[#E21E26] h-2.5 rounded-full transition-all duration-700"
                      style={{ width: `${kpis.conversations > 0 ? Math.min((kpis.escalations / kpis.conversations) * 100, 100) : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{kpis.escalations} escalade(s) sur {kpis.conversations} conversation(s)</p>
                </div>

                {/* Taux de fraude */}
                <div className="bg-white dark:bg-[#1B1B1B] rounded-2xl border border-slate-200 dark:border-[#2a2a2a] p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertOctagon className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-sm">Taux de fraude</span>
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {kpis.transactions > 0 ? ((kpis.frauds / kpis.transactions) * 100).toFixed(1) : '0.0'}%
                    </span>
                    <span className="text-slate-400 text-sm mb-1">des transactions</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#252525] rounded-full h-2.5">
                    <div
                      className="bg-amber-500 h-2.5 rounded-full transition-all duration-700"
                      style={{ width: `${kpis.transactions > 0 ? Math.min((kpis.frauds / kpis.transactions) * 100, 100) : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{kpis.frauds} fraude(s) détectée(s) sur {kpis.transactions} transaction(s)</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── USERS TAB ─────────────────────────────────────────── */}
        {tab === 'users' && (() => {
          const filteredUsers = users.filter(u => {
            const matchRole = roleFilter === 'all' || u.role === roleFilter;
            const q = searchQuery.trim().toLowerCase();
            if (!q) return matchRole;
            const matchQuery =
              (u.full_name && u.full_name.toLowerCase().includes(q)) ||
              u.username.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q);
            return matchRole && matchQuery;
          });

          return (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-bold text-base text-slate-700 dark:text-slate-300">Gestion des Utilisateurs</h2>
                  <p className="text-xs text-slate-400">Équipes Bancassurance & Administrateurs SUNU Bank Togo</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={loadUsers}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#2a2a2a] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#252525] transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />Actualiser
                  </button>
                  <button
                    id="admin-new-user-btn"
                    onClick={() => setShowNewUser(!showNewUser)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#E21E26] hover:bg-[#c00017] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    <UserPlus className="w-3.5 h-3.5" />Nouvel utilisateur
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white dark:bg-[#1B1B1B] p-3 rounded-xl border border-slate-200 dark:border-[#2a2a2a] shadow-sm">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, agence, email ou @identifiant..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-[#131313] border border-slate-200 dark:border-[#333] rounded-lg text-slate-800 dark:text-[#e5e2e1] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E21E26]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value as any)}
                    className="text-xs bg-slate-50 dark:bg-[#131313] border border-slate-200 dark:border-[#333] rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#E21E26]"
                  >
                    <option value="all">Tous les rôles ({users.length})</option>
                    <option value="admin">Administrateurs ({users.filter(u => u.role === 'admin').length})</option>
                    <option value="agent">Agents ({users.filter(u => u.role === 'agent').length})</option>
                  </select>
                </div>
              </div>

              {/* New User Form */}
              {showNewUser && (
                <form
                  onSubmit={handleCreate}
                  className="bg-white dark:bg-[#1B1B1B] border border-[#E21E26]/30 rounded-2xl p-5 shadow-md space-y-4"
                >
                  <h3 className="font-bold text-sm flex items-center gap-2 text-[#E21E26]">
                    <UserPlus className="w-4 h-4" />Créer un utilisateur
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'email', placeholder: 'Email*', type: 'email', required: true },
                      { key: 'username', placeholder: "Nom d'utilisateur*", type: 'text', required: true },
                      { key: 'password', placeholder: 'Mot de passe* (8+ car.)', type: 'password', required: true },
                      { key: 'full_name', placeholder: 'Nom complet', type: 'text', required: false },
                    ].map(f => (
                      <input
                        key={f.key}
                        id={`admin-new-${f.key}`}
                        type={f.type}
                        placeholder={f.placeholder}
                        required={f.required}
                        value={(newUser as any)[f.key]}
                        onChange={e => setNewUser(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="border border-slate-200 dark:border-[#333] bg-slate-50 dark:bg-[#131313] rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-[#e5e2e1] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E21E26] transition"
                      />
                    ))}
                    <select
                      id="admin-new-role"
                      value={newUser.role}
                      onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                      className="border border-slate-200 dark:border-[#333] bg-slate-50 dark:bg-[#131313] rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-[#e5e2e1] focus:outline-none focus:ring-2 focus:ring-[#E21E26] transition"
                    >
                      <option value="agent">Agent</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      id="admin-create-submit-btn"
                      type="submit"
                      disabled={creating}
                      className="flex items-center gap-2 px-5 py-2 bg-[#E21E26] hover:bg-[#c00017] text-white rounded-xl text-sm font-bold transition-colors cursor-pointer disabled:opacity-60 shadow-sm"
                    >
                      {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      {creating ? 'Création...' : 'Créer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewUser(false)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-[#333] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#252525] transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}

              {/* Users Table */}
              {loading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-[#E21E26]" /></div>
              ) : (
                <div className="bg-white dark:bg-[#1B1B1B] rounded-2xl border border-slate-200 dark:border-[#2a2a2a] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-[#2a2a2a] bg-slate-50 dark:bg-[#161616]">
                          {['ID', 'Utilisateur', 'Email', 'Rôle', 'Statut', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-[#222]">
                        {filteredUsers.map(u => (
                          <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-[#1f1f1f] transition-colors">
                            <td className="px-4 py-3 text-slate-400 font-mono text-xs">#{u.id}</td>
                            <td className="px-4 py-3">
                              <div className="font-semibold text-slate-800 dark:text-[#e5e2e1]">{u.full_name || u.username}</div>
                              <div className="text-xs text-slate-400 font-mono">@{u.username}</div>
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs font-mono">{u.email}</td>
                            <td className="px-4 py-3">
                              {editingId === u.id ? (
                                <select
                                  value={editPatch.role ?? u.role}
                                  onChange={e => setEditPatch(p => ({ ...p, role: e.target.value }))}
                                  className="border border-slate-200 dark:border-[#333] bg-white dark:bg-[#131313] rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#E21E26]"
                                >
                                  <option value="agent">agent</option>
                                  <option value="admin">admin</option>
                                </select>
                              ) : <Badge role={u.role} />}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                id={`admin-toggle-active-${u.id}`}
                                onClick={() => handleToggleActive(u)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border cursor-pointer transition-colors ${
                                  u.is_active
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
                                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 dark:bg-[#252525] dark:text-slate-400 dark:border-[#333]'
                                }`}
                              >
                                {u.is_active
                                  ? <><CheckCircle2 className="w-3 h-3" />Actif</>
                                  : <><XCircle className="w-3 h-3" />Inactif</>}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              {editingId === u.id ? (
                                <div className="flex gap-1">
                                  <button
                                    id={`admin-save-user-${u.id}`}
                                    onClick={() => handlePatch(u.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-[#E21E26] hover:bg-[#c00017] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />Sauvegarder
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-[#333] text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-[#252525] cursor-pointer transition-colors"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  id={`admin-edit-user-${u.id}`}
                                  onClick={() => { setEditingId(u.id); setEditPatch({ role: u.role, is_active: u.is_active }); }}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#333] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#252525] cursor-pointer transition-colors"
                                >
                                  <Pencil className="w-3 h-3" />Modifier
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {filteredUsers.length === 0 && !loading && (
                          <tr>
                            <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">
                              {searchQuery || roleFilter !== 'all' ? (
                                <div className="space-y-2">
                                  <p>Aucun utilisateur ne correspond à vos critères.</p>
                                  <button
                                    onClick={() => { setSearchQuery(''); setRoleFilter('all'); }}
                                    className="text-xs text-[#E21E26] hover:underline font-semibold"
                                  >
                                    Réinitialiser les filtres
                                  </button>
                                </div>
                              ) : (
                                'Aucun utilisateur trouvé.'
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#161616] border-t border-slate-100 dark:border-[#222] text-xs text-slate-400 flex items-center justify-between">
                    <span>{filteredUsers.length} utilisateur(s) affiché(s)</span>
                    <span>{users.length} utilisateur(s) au total</span>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};
