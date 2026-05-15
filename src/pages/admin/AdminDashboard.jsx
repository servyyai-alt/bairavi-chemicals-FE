import { useState, useEffect } from 'react';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { getDashboardStats } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

const STATUS_STYLES = {
  pending:    { bg: 'rgba(245,158,11,0.1)',  color: '#d97706',  label: 'Pending'    },
  confirmed:  { bg: 'rgba(11,79,156,0.1)',   color: '#0B4F9C',  label: 'Confirmed'  },
  processing: { bg: 'rgba(11,79,156,0.1)',   color: '#0B4F9C',  label: 'Processing' },
  shipped:    { bg: 'rgba(20,184,166,0.1)',  color: '#0d9488',  label: 'Shipped'    },
  delivered:  { bg: 'rgba(34,197,94,0.1)',   color: '#16a34a',  label: 'Delivered'  },
  cancelled:  { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626',  label: 'Cancelled'  },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getDashboardStats();
        setStats(data.stats || null);
      }
      catch {}
      setLoading(false);
    })();
  }, []);

  const CARDS = [
    { label: 'Total Revenue', value: stats ? `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}` : null, icon: FiDollarSign, color: '#0B4F9C', bg: 'rgba(11,79,156,0.08)', trend: '+12.5%', up: true },
    { label: 'Total Orders',  value: stats?.totalOrders, icon: FiShoppingBag, color: '#0d9488', bg: 'rgba(13,148,136,0.08)', trend: '+8.2%', up: true },
    { label: 'Products',      value: stats?.totalProducts, icon: FiPackage,  color: '#d97706', bg: 'rgba(217,119,6,0.08)', trend: '+3', up: true },
    { label: 'Registered Users', value: stats?.totalUsers, icon: FiUsers,   color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', trend: '+5.1%', up: true },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800" style={{ letterSpacing: '-0.02em' }}>Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-xs text-slate-400 px-3 py-2 rounded-xl" style={{ background: 'rgba(11,79,156,0.06)', border: '1px solid rgba(11,79,156,0.1)' }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="p-5 rounded-3xl transition-all duration-300"
              style={{ background: 'white', border: '1px solid rgba(11,79,156,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${c.color}18`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.04)'; }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: c.bg, color: c.color }}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#16a34a' }}>
                  <FiArrowUpRight className="w-3 h-3" /> {c.trend}
                </span>
              </div>
              {loading ? (
                <div className="h-8 w-24 rounded-xl skeleton mb-1" />
              ) : (
                <div className="font-display text-2xl font-bold text-slate-800 mb-0.5" style={{ letterSpacing: '-0.02em' }}>
                  {c.value ?? '—'}
                </div>
              )}
              <div className="text-xs text-slate-400 font-medium">{c.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="rounded-3xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(11,79,156,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(11,79,156,0.06)' }}>
          <div>
            <h2 className="font-display font-bold text-slate-800">Recent Orders</h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest chemical orders placed</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(11,79,156,0.08)', color: '#0B4F9C' }}>
            <FiTrendingUp className="w-3 h-3" /> Live
          </span>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-12" />)}
          </div>
        ) : stats?.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#f8faff' }}>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o, i) => {
                  const st = STATUS_STYLES[o.orderStatus] || STATUS_STYLES.pending;
                  return (
                    <tr key={o._id} className="transition-colors hover:bg-primary-50/50" style={{ borderTop: '1px solid rgba(11,79,156,0.05)' }}>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold" style={{ color: '#0B4F9C' }}>
                          #{o._id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">{o.user?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{o.orderItems?.length} item(s)</td>
                      <td className="px-6 py-4 text-sm font-bold" style={{ color: '#0B4F9C' }}>₹{o.totalPrice?.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold px-3 py-1 rounded-full capitalize"
                          style={{ background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-slate-400 text-sm">No orders yet</p>
          </div>
        )}
      </div>
      </div>
    </AdminLayout>
  );
}
