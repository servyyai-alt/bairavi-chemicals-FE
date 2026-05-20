import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FiPackage, FiTag, FiShoppingBag, FiUsers, FiMenu, FiX, FiLogOut, FiBarChart2, FiChevronRight, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { icon: FiBarChart2,  label: 'Dashboard',  to: '/admin/dashboard', accent: '#0B4F9C' },
  { icon: FiPackage,    label: 'Products',   to: '/admin/products',  accent: '#0d9488' },
  { icon: FiTag,        label: 'Categories', to: '/admin/categories',accent: '#d97706' },
  { icon: FiShoppingBag,label: 'Orders',     to: '/admin/orders',    accent: '#7c3aed' },
  { icon: FiUsers,      label: 'Users',      to: '/admin/users',     accent: '#dc2626' },
  { icon: FiSettings,   label: 'Settings',   to: '/admin/settings',  accent: '#475569' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f0f4fe' }}>
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: '#06091a', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-base font-bold"
            style={{ background: 'linear-gradient(135deg,#0B4F9C,#1a70ff)' }}>⚗</div>
          <div>
            <div className="font-display font-bold text-white text-sm">Sri Bairavi</div>
            <div className="text-[9px] font-bold tracking-[0.15em] uppercase" style={{ color: '#22c55e' }}>ADMIN PANEL</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 mb-1" style={{ color: 'rgba(255,255,255,0.2)' }}>Management</p>
          {NAV.map(({ icon: Icon, label, to, accent }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden"
                style={{
                  background: active ? `${accent}18` : 'transparent',
                  color: active ? 'white' : 'rgba(255,255,255,0.4)',
                  border: active ? `1px solid ${accent}30` : '1px solid transparent',
                }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{ background: active ? accent : 'rgba(255,255,255,0.06)', color: active ? 'white' : 'rgba(255,255,255,0.4)' }}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{label}</span>
                {active && <FiChevronRight className="w-3.5 h-3.5 ml-auto" style={{ color: accent }} />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 p-3 rounded-2xl mb-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#0B4F9C,#1a70ff)' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Administrator</div>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors hover:text-white mb-1"
            style={{ color: 'rgba(255,255,255,0.35)' }}>
            ← View Store
          </Link>
          <button onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs w-full transition-colors hover:text-red-400"
            style={{ color: 'rgba(255,255,255,0.35)' }}>
            <FiLogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 flex-shrink-0"
          style={{ background: 'white', borderBottom: '1px solid rgba(11,79,156,0.07)', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
          <button onClick={() => setOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100 text-slate-500">
            <FiMenu className="w-5 h-5" />
          </button>
          <div className="flex-1 lg:flex-none" />
          <div className="text-xs font-medium text-slate-400">
            Sri Bairavi Chemicals — Admin
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
