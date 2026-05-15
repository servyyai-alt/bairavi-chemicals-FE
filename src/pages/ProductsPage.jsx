import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiSliders } from 'react-icons/fi';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/common/ProductCard';

const GRADES = ['industrial', 'laboratory', 'analytical', 'pharmaceutical', 'reagent', 'technical'];
const SORTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductsPage() {
  const [sp, setSp] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(sp.get('search') || '');
  const [filterOpen, setFilterOpen] = useState(false);

  const activeCat   = sp.get('category') || '';
  const activeGrade = sp.get('grade') || '';
  const activeSort  = sp.get('sort') || 'newest';

  const setParam = (k, v) => {
    const p = new URLSearchParams(sp);
    v ? p.set(k, v) : p.delete(k);
    p.delete('page'); setPage(1); setSp(p);
  };
  const clearAll = () => { setSp({}); setSearch(''); setPage(1); };
  const hasFilters = activeCat || activeGrade || search;

  useEffect(() => {
    (async () => { const { data } = await getCategories(); setCategories(data.categories || []); })();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (activeCat) params.category = activeCat;
      if (activeGrade) params.grade = activeGrade;
      if (activeSort === 'price_asc') { params.sortBy = 'price'; params.sortOrder = 'asc'; }
      if (activeSort === 'price_desc') { params.sortBy = 'price'; params.sortOrder = 'desc'; }
      if (activeSort === 'rating') { params.sortBy = 'rating'; params.sortOrder = 'desc'; }
      const { data } = await getProducts(params);
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch {}
    setLoading(false);
  }, [page, search, activeCat, activeGrade, activeSort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const totalPages = Math.ceil(total / 12);

  return (
    <div style={{ background: '#f8faff', minHeight: '100vh' }}>

      {/* Header */}
      <section className="relative py-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #020f1e 0%, #083B73 60%, #0B4F9C 100%)' }}>
        <div className="absolute inset-0 bg-grid-white bg-grid" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <span className="section-label mb-4 block">Catalogue</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3" style={{ letterSpacing: '-0.03em' }}>
            Chemical Products
          </h1>
          <p className="text-slate-300 mb-8 text-lg">{total > 0 ? `${total} products available` : 'Loading catalogue…'}</p>

          {/* Search bar */}
          <form onSubmit={e => { e.preventDefault(); setParam('search', search); }} className="max-w-xl">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by chemical name, CAS number, grade…"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-green bg-white"
                />
                {search && (
                  <button type="button" onClick={() => { setSearch(''); setParam('search', ''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button type="submit" className="btn-green !py-3.5 !px-6"><span>Search</span></button>
            </div>
          </form>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0,20 C480,40 960,0 1440,20 L1440,40 L0,40 Z" fill="#f8faff"/></svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-7">

        {/* Sidebar */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="sticky top-24 rounded-3xl overflow-hidden"
            style={{ background: 'white', border: '1px solid rgba(11,79,156,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(11,79,156,0.06)' }}>
              <span className="font-display font-bold text-slate-700 text-sm flex items-center gap-2"><FiSliders className="w-4 h-4 text-primary-600" /> Filters</span>
              {hasFilters && <button onClick={clearAll} className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">Clear</button>}
            </div>

            <div className="p-4 space-y-6">
              {/* Category */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Category</p>
                <ul className="space-y-0.5">
                  <li>
                    <button onClick={() => setParam('category', '')}
                      className="w-full text-left text-sm px-3 py-2 rounded-xl transition-all duration-150 font-medium"
                      style={{ background: !activeCat ? 'rgba(11,79,156,0.1)' : 'transparent', color: !activeCat ? '#0B4F9C' : '#64748b' }}>
                      All Categories
                    </button>
                  </li>
                  {categories.map(c => (
                    <li key={c._id}>
                      <button onClick={() => setParam('category', c._id)}
                        className="w-full text-left text-sm px-3 py-2 rounded-xl transition-all duration-150"
                        style={{ background: activeCat === c._id ? 'rgba(11,79,156,0.1)' : 'transparent', color: activeCat === c._id ? '#0B4F9C' : '#64748b', fontWeight: activeCat === c._id ? 600 : 400 }}>
                        {c.icon} {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Grade */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Grade</p>
                <ul className="space-y-0.5">
                  <li>
                    <button onClick={() => setParam('grade', '')}
                      className="w-full text-left text-sm px-3 py-2 rounded-xl transition-all capitalize"
                      style={{ background: !activeGrade ? 'rgba(11,79,156,0.1)' : 'transparent', color: !activeGrade ? '#0B4F9C' : '#64748b', fontWeight: !activeGrade ? 600 : 400 }}>
                      All Grades
                    </button>
                  </li>
                  {GRADES.map(g => (
                    <li key={g}>
                      <button onClick={() => setParam('grade', g)}
                        className="w-full text-left text-sm px-3 py-2 rounded-xl transition-all capitalize"
                        style={{ background: activeGrade === g ? 'rgba(11,79,156,0.1)' : 'transparent', color: activeGrade === g ? '#0B4F9C' : '#64748b', fontWeight: activeGrade === g ? 600 : 400 }}>
                        {g}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </aside>

        {/* Products area */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
            <div className="flex flex-wrap gap-2">
              {hasFilters && (
                <>
                  {search && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(11,79,156,0.1)', color: '#0B4F9C', border: '1px solid rgba(11,79,156,0.2)' }}>
                      "{search}" <button onClick={() => { setSearch(''); setParam('search', ''); }}><FiX className="w-3 h-3" /></button>
                    </span>
                  )}
                  {activeCat && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(11,79,156,0.1)', color: '#0B4F9C', border: '1px solid rgba(11,79,156,0.2)' }}>
                      {categories.find(c => c._id === activeCat)?.name} <button onClick={() => setParam('category', '')}><FiX className="w-3 h-3" /></button>
                    </span>
                  )}
                  {activeGrade && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold capitalize px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(11,79,156,0.1)', color: '#0B4F9C', border: '1px solid rgba(11,79,156,0.2)' }}>
                      {activeGrade} <button onClick={() => setParam('grade', '')}><FiX className="w-3 h-3" /></button>
                    </span>
                  )}
                </>
              )}
              {!hasFilters && <p className="text-sm text-slate-400">{loading ? 'Loading…' : `${total} chemicals found`}</p>}
            </div>
            <div className="flex items-center gap-3">
              <select value={activeSort} onChange={e => setParam('sort', e.target.value)}
                className="text-sm border rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white font-medium"
                style={{ borderColor: 'rgba(11,79,156,0.15)', color: '#475569' }}>
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <button onClick={() => setFilterOpen(!filterOpen)}
                className="lg:hidden flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-2xl bg-white transition-colors hover:bg-gray-50"
                style={{ border: '1px solid rgba(11,79,156,0.15)', color: '#475569' }}>
                <FiFilter className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array(12).fill(0).map((_, i) => <div key={i} className="skeleton h-72" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🧪</div>
              <h3 className="font-display font-bold text-xl text-slate-600 mb-2">No chemicals found</h3>
              <p className="text-slate-400 text-sm mb-6">Try different search terms or remove filters</p>
              <button onClick={clearAll} className="btn-outline">Clear All Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-semibold transition-all disabled:opacity-30"
                    style={{ background: 'white', border: '1px solid rgba(11,79,156,0.15)', color: '#475569' }}>
                    ‹
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setPage(n)}
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all"
                      style={page === n
                        ? { background: 'linear-gradient(135deg,#0B4F9C,#1a70ff)', color: 'white', boxShadow: '0 4px 16px rgba(11,79,156,0.35)' }
                        : { background: 'white', border: '1px solid rgba(11,79,156,0.15)', color: '#475569' }}>
                      {n}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-semibold transition-all disabled:opacity-30"
                    style={{ background: 'white', border: '1px solid rgba(11,79,156,0.15)', color: '#475569' }}>
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
