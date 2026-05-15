import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX,
  FiLogOut, FiPackage, FiSettings, FiChevronDown, FiPhone, FiArrowRight
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const hideSearch = location.pathname === '/products';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropdown(false); }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    navigate(`/products?search=${encodeURIComponent(q)}`);
    setSearch(''); setSearchOpen(false); setMobileOpen(false);
  };

  return (
    <>
      {/* Top accent bar */}
      <div style={{ background: 'linear-gradient(90deg, #0B4F9C, #1a70ff, #22c55e)' }}
        className="text-white text-xs py-2 px-4 hidden md:flex items-center justify-between">
        <span className="flex items-center gap-4 opacity-90">
          <span>🧪 ISO 9001 Certified Supplier</span>
          <span className="w-px h-3 bg-white/30" />
          <span>🚚 Pan-India Chemical Delivery</span>
        </span>
        <a href="tel:+919842209470" className="flex items-center gap-1.5 font-medium hover:opacity-80 transition-opacity">
          <FiPhone className="w-3 h-3" /> +91 98422 09470
        </a>
      </div>

      <header
        className="sticky top-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? 'rgba(248,250,255,0.95)'
            : 'rgba(248,250,255,0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(11,79,156,0.1)' : '1px solid rgba(11,79,156,0.06)',
          boxShadow: scrolled ? '0 4px 32px rgba(11,79,156,0.08)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-[68px] gap-4">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-glow-sm transition-all duration-300 group-hover:shadow-glow-md"
                  style={{ background: 'linear-gradient(135deg, #0B4F9C, #1a70ff)' }}>
                  ⚗
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent-green border-2 border-white" />
              </div>
              <div>
                <div className="font-display font-bold text-[15px] leading-tight tracking-tight text-slate-900">Sri Bairavi</div>
                <div className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: '#22c55e' }}>CHEMICALS</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(l => {
                const active = location.pathname === l.to;
                return (
                  <Link key={l.to} to={l.to}
                    className="relative text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200"
                    style={{ color: active ? '#0B4F9C' : '#475569' }}>
                    {l.label}
                    {active && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: '#0B4F9C' }} />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">

              {/* Search toggle */}
              {!hideSearch && (
                <button onClick={() => setSearchOpen(!searchOpen)}
                  className="hidden md:flex w-9 h-9 rounded-xl items-center justify-center transition-all duration-200 hover:bg-primary-50"
                  style={{ color: '#475569' }}>
                  <FiSearch className="w-4.5 h-4.5" />
                </button>
              )}

              {user && !isAdmin && (
                <>
                  <Link to="/wishlist"
                    className="w-9 h-9 rounded-xl hidden md:flex items-center justify-center transition-all duration-200 hover:bg-primary-50 relative"
                    style={{ color: '#475569' }}>
                    <FiHeart className="w-4.5 h-4.5" />
                  </Link>
                  <Link to="/cart"
                    className="w-9 h-9 rounded-xl hidden md:flex items-center justify-center transition-all duration-200 hover:bg-primary-50 relative"
                    style={{ color: '#475569' }}>
                    <FiShoppingCart className="w-4.5 h-4.5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                        style={{ background: '#22c55e' }}>
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {user ? (
                <div className="relative">
                  <button onClick={() => setDropdown(!dropdown)}
                    className="flex items-center gap-2.5 pl-3 pr-3 py-2 rounded-2xl transition-all duration-200 hover:bg-gray-100">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, #0B4F9C, #1a70ff)' }}>
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-slate-700">{user.name.split(' ')[0]}</span>
                    <FiChevronDown className={`hidden md:block w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-3xl overflow-hidden border border-gray-100 animate-fade-in"
                      style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
                      <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg, #f0f4fe, #f8faff)' }}>
                        <p className="text-sm font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                      </div>
                      <div className="p-2">
                        {isAdmin ? (
                          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-colors text-slate-600">
                            <FiSettings className="w-4 h-4" /> Admin Panel
                          </Link>
                        ) : (
                          <>
                            <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-colors text-slate-600">
                              <FiUser className="w-4 h-4" /> My Profile
                            </Link>
                            <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-colors text-slate-600">
                              <FiPackage className="w-4 h-4" /> My Orders
                            </Link>
                          </>
                        )}
                        <div className="my-2 border-t border-gray-100" />
                        <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl hover:bg-red-50 text-red-500 transition-colors w-full">
                          <FiLogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn-primary hidden md:inline-flex !py-2 !px-5 !text-sm">
                  <span>Sign In</span>
                </Link>
              )}

              {/* Mobile menu */}
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors text-slate-600">
                {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar slide-down */}
        <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? 'max-h-20 border-t border-gray-100' : 'max-h-0'}`}>
          <div className="max-w-7xl mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search chemicals, CAS number, category…"
                  className="input-field pl-11 py-3" autoFocus={searchOpen} />
              </div>
              <button type="submit" className="btn-primary !py-2.5 !px-5 !text-sm"><span>Search</span></button>
            </form>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100" style={{ background: 'rgba(248,250,255,0.98)' }}>
            <div className="px-4 py-4 space-y-1">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chemicals…" className="input-field pl-11" />
                </div>
              </form>
              {NAV_LINKS.map(l => (
                <Link key={l.to} to={l.to}
                  className="flex items-center justify-between py-3 border-b border-gray-100 text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">
                  {l.label} <FiArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
              ))}
              {user ? (
                <button onClick={logout} className="flex items-center gap-2 py-3 text-sm font-medium text-red-500 w-full">
                  <FiLogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <Link to="/login" className="btn-primary w-full mt-3 text-center block"><span>Sign In</span></Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
