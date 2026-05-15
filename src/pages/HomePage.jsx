import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiAward, FiPhone, FiCheckCircle, FiStar, FiZap } from 'react-icons/fi';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/common/ProductCard';

/* ── Constants ────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { name: 'Industrial Chemicals',  icon: '🏭', slug: 'industrial-chemicals',  color: '#0B4F9C' },
  { name: 'Laboratory Chemicals',  icon: '🔬', slug: 'laboratory-chemicals',  color: '#0d9488' },
  { name: 'Water Treatment',       icon: '💧', slug: 'water-treatment',       color: '#0ea5e9' },
  { name: 'Cleaning Chemicals',    icon: '✨', slug: 'cleaning-chemicals',    color: '#7c3aed' },
  { name: 'Solvents',              icon: '🫙', slug: 'solvents',              color: '#d97706' },
  { name: 'Acids & Alkalis',       icon: '⚗️', slug: 'acids-alkalis',        color: '#dc2626' },
  { name: 'Specialty Chemicals',   icon: '🔮', slug: 'specialty-chemicals',   color: '#6366f1' },
  { name: 'Raw Materials',         icon: '📦', slug: 'raw-materials',         color: '#16a34a' },
];

const STATS = [
  { value: '500+', label: 'Chemical Products', icon: '🧪' },
  { value: '1,200+', label: 'Happy Clients', icon: '🏢' },
  { value: '15+', label: 'Years of Trust', icon: '🏆' },
  { value: '98%', label: 'On-time Delivery', icon: '🚚' },
];

const FEATURES = [
  { icon: '✅', title: 'ISO 9001 Certified', desc: 'Every batch tested with Certificate of Analysis (COA) provided on request.' },
  { icon: '🚚', title: 'Reliable Pan-India Delivery', desc: 'Proper chemical packaging, labelling, and documentation for every shipment.' },
  { icon: '💬', title: 'Expert Technical Support', desc: 'Guidance on chemical selection, application suitability, and safety handling.' },
  { icon: '📦', title: 'Flexible Packaging', desc: 'Bags, drums, IBC tanks, canisters — customised to your requirement.' },
];

const TESTIMONIALS = [
  { name: 'Ramesh Kumar', company: 'Apex Textiles Ltd', rating: 5, initial: 'R', text: 'Consistent quality and timely delivery. Sri Bairavi is our go-to supplier for industrial chemicals.' },
  { name: 'Dr. Meena Priya', company: 'BioLab Research Institute', rating: 5, initial: 'M', text: 'Lab-grade reagents at competitive prices. Purity certificates provided with every batch — very professional.' },
  { name: 'Suresh Babu', company: 'Metro Water Works', rating: 5, initial: 'S', text: 'Their water treatment chemicals have been integral to our plant operations for 3+ years. Zero quality complaints.' },
];

/* ── Animated particle background ───────────────────────────────────── */
function HeroParticles() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      a: Math.random() * 0.45 + 0.08,
      color: Math.random() > 0.6 ? '34,197,94' : '255,255,255',
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // Lines between close particles
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, pts[i].r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pts[i].color},${pts[i].a})`;
        ctx.fill();
        pts[i].x += pts[i].dx; pts[i].y += pts[i].dy;
        if (pts[i].x < 0 || pts[i].x > W) pts[i].dx *= -1;
        if (pts[i].y < 0 || pts[i].y > H) pts[i].dy *= -1;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { W = canvas.offsetWidth; H = canvas.offsetHeight; canvas.width = W; canvas.height = H; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }} />;
}

/* ── Animated counter ────────────────────────────────────────────────── */
function Counter({ value, label, icon }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const num = parseInt(value.replace(/[^0-9]/g, ''));
      const suffix = value.replace(/[0-9]/g, '');
      let cur = 0, step = Math.ceil(num / 45);
      const t = setInterval(() => {
        cur = Math.min(cur + step, num);
        setDisplay(cur.toLocaleString('en-IN') + suffix);
        if (cur >= num) clearInterval(t);
      }, 35);
      observer.disconnect();
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);
  return (
    <div ref={ref} className="text-center group">
      <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-125">{icon}</div>
      <div className="font-display text-4xl md:text-5xl font-bold text-white mb-1"
        style={{ letterSpacing: '-0.03em' }}>{display}</div>
      <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          getProducts({ featured: true, limit: 8 }),
          getCategories()
        ]);
        setFeatured(pRes.data.products || []);
        setCategories(cRes.data.categories?.length ? cRes.data.categories : CATEGORIES.map((c, i) => ({ ...c, _id: String(i) })));
      } catch {}
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[640px] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #020f1e 0%, #06091a 40%, #041f3d 100%)' }}>

        {/* Grid texture */}
        <div className="absolute inset-0 bg-grid-white bg-grid opacity-100" />

        {/* Radial glow orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(11,79,156,0.35) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)' }} />

        <HeroParticles />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-16 items-center">

          {/* Left text */}
          <div className="animate-fade-in">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-bold tracking-widest uppercase"
              style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              Trusted Since 2009 · ISO 9001 Certified
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
              style={{ letterSpacing: '-0.04em', lineHeight: 1.05 }}>
              Quality<br />
              <span style={{
                background: 'linear-gradient(135deg, #4d90ff, #22c55e)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Chemicals,</span><br />
              Trusted Solutions
            </h1>

            <p className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              Industrial, Laboratory, and Specialty Chemical Solutions for Modern Industries.
              Pan-India delivery with certified quality assurance.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-10">
              <button onClick={() => navigate('/products')} className="btn-primary !py-3.5 !px-8">
                <span className="flex items-center gap-2">Explore Products <FiArrowRight /></span>
              </button>
              <button onClick={() => navigate('/contact')} className="btn-ghost !py-3.5 !px-8">
                <span className="flex items-center gap-2"><FiPhone className="w-4 h-4" /> Get Quotation</span>
              </button>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {['GMP Compliant', 'MSDS Provided', 'Bulk Orders Welcome'].map(t => (
                <span key={t} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <FiCheckCircle className="w-4 h-4" style={{ color: '#22c55e' }} /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: floating cards */}
          <div className="hidden md:grid grid-cols-2 gap-4 animate-slide-up">
            {[
              { emoji: '⚗️', label: 'Industrial Grade', sub: '99%+ purity assured', glow: '#0B4F9C' },
              { emoji: '🔬', label: 'Lab Reagents',     sub: 'Analytical & reagent', glow: '#0d9488' },
              { emoji: '💧', label: 'Water Treatment',  sub: 'Plant-grade solutions', glow: '#0ea5e9' },
              { emoji: '🛡️', label: 'Safety Certified', sub: 'MSDS on every order',  glow: '#22c55e' },
            ].map((c, i) => (
              <div key={i} className="p-5 rounded-3xl text-center transition-all duration-500 cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  backdropFilter: 'blur(16px)',
                  animationDelay: `${i * 0.1}s`,
                }}
                onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${c.glow}40`; e.currentTarget.style.boxShadow = `0 0 30px ${c.glow}20`; }}
                onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.09)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div className="text-4xl mb-3 animate-float" style={{ animationDelay: `${i * 0.8}s` }}>{c.emoji}</div>
                <div className="text-white font-semibold text-sm font-display">{c.label}</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#f8faff" />
          </svg>
        </div>
      </section>

      {/* ── TRUST STRIP ─────────────────────────────────────────────── */}
      <section className="py-5 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-gray-100">
            {[
              { icon: <FiTruck className="w-5 h-5" />, text: 'Pan-India Delivery', sub: 'Reliable bulk logistics' },
              { icon: <FiShield className="w-5 h-5" />, text: 'ISO 9001 Certified', sub: 'Verified quality processes' },
              { icon: <FiAward className="w-5 h-5" />, text: '15+ Years Experience', sub: 'Industry specialists' },
              { icon: <FiZap className="w-5 h-5" />, text: '500+ Chemicals', sub: 'Comprehensive catalogue' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 justify-center px-4 py-3">
                <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: 'rgba(11,79,156,0.08)', color: '#0B4F9C' }}>
                  {b.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{b.text}</div>
                  <div className="text-xs text-slate-400">{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────────────────── */}
      <section className="section" style={{ background: '#f8faff' }}>
        <div className="container-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="section-label mb-3 block">Our Catalogue</span>
              <h2 className="section-title">Browse by Category</h2>
            </div>
            <Link to="/products" className="btn-outline self-start md:self-auto !py-2.5 !px-6 !text-sm whitespace-nowrap">
              View All <FiArrowRight className="inline ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(categories.length > 0 ? categories : CATEGORIES).slice(0, 8).map((cat, i) => {
              const meta = CATEGORIES.find(c => c.name === cat.name) || CATEGORIES[i % CATEGORIES.length];
              return (
                <Link key={cat._id || i}
                  to={`/products?category=${cat._id || cat.slug}`}
                  className="group relative overflow-hidden flex flex-col items-center text-center p-6 rounded-3xl transition-all duration-350"
                  style={{ background: 'white', border: '1px solid rgba(11,79,156,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = `${meta.color}30`;
                    e.currentTarget.style.boxShadow = `0 20px 48px ${meta.color}18`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.borderColor = 'rgba(11,79,156,0.07)';
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.04)';
                  }}>
                  {/* Icon circle */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${meta.color}12` }}>
                    {cat.icon || meta.icon}
                  </div>
                  <h3 className="font-display font-semibold text-sm text-slate-800 group-hover:text-primary-600 transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  {/* Hover arrow */}
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <FiArrowRight className="w-4 h-4 mx-auto" style={{ color: meta.color }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="section-label mb-3 block">Top Picks</span>
              <h2 className="section-title">Featured Chemicals</h2>
            </div>
            <Link to="/products?featured=true" className="btn-outline self-start md:self-auto !py-2.5 !px-6 !text-sm whitespace-nowrap">
              Browse All <FiArrowRight className="inline ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton h-72" />)}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <div className="text-6xl mb-4">🧪</div>
              <p className="font-semibold text-slate-500 text-lg">No featured products yet.</p>
              <p className="text-sm mt-1">Check back soon or browse our full catalogue.</p>
              <Link to="/products" className="btn-primary inline-flex mt-6"><span>Browse All</span></Link>
            </div>
          )}
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <section className="section-sm relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #020f1e 0%, #083B73 50%, #0B4F9C 100%)' }}>
        <div className="absolute inset-0 bg-grid-white bg-grid opacity-100" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(34,197,94,0.08) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
            {STATS.map((s, i) => <Counter key={i} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────── */}
      <section className="section" style={{ background: '#f8faff' }}>
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <span className="section-label mb-4 block">Why Us</span>
              <h2 className="section-title mb-6">Built on Quality,<br />Backed by Expertise</h2>
              <p className="text-slate-500 leading-relaxed mb-10">
                With over 15 years serving industries across India, Sri Bairavi Chemicals delivers consistent quality,
                competitive pricing, and reliable supply you can count on.
              </p>
              <div className="space-y-5">
                {FEATURES.map((f, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110"
                      style={{ background: 'white', boxShadow: '0 4px 20px rgba(11,79,156,0.1)' }}>
                      {f.icon}
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-slate-800 mb-0.5">{f.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="btn-primary inline-flex mt-10">
                <span className="flex items-center gap-2">Get Bulk Quotation <FiArrowRight /></span>
              </Link>
            </div>

            {/* Right: grid of highlight cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Chemical Products', value: '500+', icon: '🧪', color: '#0B4F9C' },
                { label: 'Active Clients',    value: '1,200+', icon: '🏢', color: '#0d9488' },
                { label: 'States Covered',    value: '28+',  icon: '🗺️', color: '#d97706' },
                { label: 'Years of Trust',    value: '15+',  icon: '🏆', color: '#7c3aed' },
              ].map((s, i) => (
                <div key={i} className="group p-6 rounded-3xl text-center transition-all duration-300 cursor-default"
                  style={{ background: 'white', border: '1px solid rgba(11,79,156,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = `0 16px 48px ${s.color}20`; e.currentTarget.style.borderColor = `${s.color}25`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = 'rgba(11,79,156,0.07)'; }}>
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <div className="font-display text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-sm text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-xl">
          <div className="text-center mb-14">
            <span className="section-label mb-4 block justify-center">Client Reviews</span>
            <h2 className="section-title">Trusted by Industries<br />Across India</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-7 rounded-3xl transition-all duration-300 group cursor-default"
                style={{ background: '#f8faff', border: '1px solid rgba(11,79,156,0.07)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(11,79,156,0.1)'; e.currentTarget.style.borderColor = 'rgba(11,79,156,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'rgba(11,79,156,0.07)'; }}>
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <FiStar key={j} className="w-4 h-4" fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#0B4F9C,#1a70ff)' }}>
                    {t.initial}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-800">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section className="section-sm relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B4F9C 0%, #083B73 50%, #041f3d 100%)' }}>
        <div className="absolute inset-0 bg-grid-white bg-grid" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }}>
            <FiZap className="w-3.5 h-3.5" /> Limited Stock on Select Items
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5" style={{ letterSpacing: '-0.03em' }}>
            Need a Bulk Quotation?
          </h2>
          <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Reach our sales team for customised pricing, technical specs, and delivery timelines for bulk chemical orders.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact"
              className="inline-flex items-center gap-2 font-semibold text-sm px-8 py-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'white', color: '#0B4F9C', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
              Request Quotation <FiArrowRight />
            </Link>
            <a href="https://wa.me/919842209470?text=Hello%20Sri%20Bairavi%20Chemicals%2C%20I%20need%20a%20quotation."
              target="_blank" rel="noreferrer"
              className="btn-ghost !py-3.5 !px-8">
              <span className="flex items-center gap-2">💬 WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   FiArrowRight,
//   FiStar,
//   FiShield,
//   FiTruck,
//   FiZap,
// } from "react-icons/fi";
// import { motion } from "framer-motion";

// export default function HomePage() {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const categories = [
//     {
//       title: "Industrial Chemicals",
//       icon: "🏭",
//       size: "col-span-2 row-span-2",
//     },
//     {
//       title: "Laboratory Chemicals",
//       icon: "🧪",
//     },
//     {
//       title: "Water Treatment",
//       icon: "💧",
//     },
//     {
//       title: "Cleaning Chemicals",
//       icon: "✨",
//     },
//     {
//       title: "Speciality Chemicals",
//       icon: "⚗️",
//     },
//   ];

//   const products = [
//     {
//       title: "Hydrochloric Acid",
//       image:
//         "https://images.unsplash.com/photo-1581093458791-9d15482442f6?q=80&w=1200&auto=format&fit=crop",
//     },
//     {
//       title: "Industrial Solvents",
//       image:
//         "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?q=80&w=1200&auto=format&fit=crop",
//     },
//     {
//       title: "Water Purification",
//       image:
//         "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
//     },
//   ];

//   const testimonials = [
//     {
//       name: "Ramesh Kumar",
//       role: "Factory Manager",
//       review:
//         "Excellent quality chemicals with very fast delivery and proper support.",
//     },
//     {
//       name: "Meena Priya",
//       role: "Lab Director",
//       review:
//         "Professional service and premium laboratory-grade chemical supplies.",
//     },
//     {
//       name: "Suresh Babu",
//       role: "Water Plant Engineer",
//       review:
//         "Reliable products and bulk pricing helped our operations significantly.",
//     },
//   ];

//   return (
//     <div className="min-h-screen overflow-hidden bg-[#050816] text-white relative">
//       {/* Aurora Background */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[120px]" />
//         <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[120px]" />
//         <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-[120px]" />
//       </div>

//       {/* Navbar */}
//       <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/5 border-b border-white/10">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//             Sri Bairavi
//           </h1>

//           <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
//             <Link to="/">Home</Link>
//             <Link to="/products">Products</Link>
//             <Link to="/about">About</Link>
//             <Link to="/contact">Contact</Link>
//           </nav>

//           <button className="px-5 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/20 transition-all">
//             Get Quote
//           </button>
//         </div>
//       </header>

//       {/* HERO */}
//       <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-24">
//         <div className="grid lg:grid-cols-2 gap-14 items-center">
//           {/* LEFT */}
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={mounted ? { opacity: 1, y: 0 } : {}}
//             transition={{ duration: 0.8 }}
//           >
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-sm text-cyan-300 mb-8">
//               <FiZap />
//               Trusted Chemical Supplier Since 2009
//             </div>

//             <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
//               Modern
//               <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
//                 Chemical
//               </span>
//               Solutions
//             </h1>

//             <p className="mt-8 text-lg text-white/60 leading-relaxed max-w-xl">
//               Premium industrial, laboratory, and specialty chemical products
//               with pan-India delivery and certified quality assurance.
//             </p>

//             <div className="mt-10 flex flex-wrap gap-4">
//               <button className="px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold hover:scale-105 transition-all flex items-center gap-2">
//                 Explore Products
//                 <FiArrowRight />
//               </button>

//               <button className="px-7 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all">
//                 Contact Us
//               </button>
//             </div>

//             {/* Stats */}
//             <div className="mt-14 grid grid-cols-3 gap-6">
//               {[
//                 ["500+", "Products"],
//                 ["1200+", "Clients"],
//                 ["15+", "Years"],
//               ].map((item, i) => (
//                 <div
//                   key={i}
//                   className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
//                 >
//                   <h2 className="text-3xl font-bold">{item[0]}</h2>
//                   <p className="text-white/50 text-sm mt-1">{item[1]}</p>
//                 </div>
//               ))}
//             </div>
//           </motion.div>

//           {/* RIGHT BENTO GRID */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={mounted ? { opacity: 1, scale: 1 } : {}}
//             transition={{ duration: 0.8 }}
//             className="grid grid-cols-2 auto-rows-[180px] gap-5"
//           >
//             {categories.map((item, i) => (
//               <div
//                 key={i}
//                 className={`${item.size || ""} rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl p-6 hover:scale-[1.03] transition-all duration-500 relative overflow-hidden group`}
//               >
//                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all" />

//                 <div className="relative z-10 h-full flex flex-col justify-between">
//                   <div className="text-5xl">{item.icon}</div>

//                   <div>
//                     <h3 className="text-2xl font-bold">{item.title}</h3>

//                     <div className="mt-3 flex items-center gap-2 text-cyan-300 text-sm">
//                       Explore
//                       <FiArrowRight />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* TRUST STRIP */}
//       <section className="relative z-10 py-10 border-y border-white/10 backdrop-blur-xl bg-white/[0.03]">
//         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
//           {[
//             {
//               icon: <FiTruck />,
//               title: "Pan India Delivery",
//             },
//             {
//               icon: <FiShield />,
//               title: "ISO Certified",
//             },
//             {
//               icon: <FiStar />,
//               title: "Premium Quality",
//             },
//           ].map((item, i) => (
//             <div
//               key={i}
//               className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl p-6 flex items-center gap-4"
//             >
//               <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-2xl">
//                 {item.icon}
//               </div>

//               <div>
//                 <h3 className="font-semibold text-lg">{item.title}</h3>
//                 <p className="text-white/50 text-sm">
//                   Trusted by industries across India
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* PRODUCTS */}
//       <section className="relative z-10 py-28">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex items-end justify-between mb-16">
//             <div>
//               <p className="text-cyan-300 uppercase tracking-[0.3em] text-sm mb-4">
//                 Featured
//               </p>

//               <h2 className="text-5xl font-bold">
//                 Premium Products
//               </h2>
//             </div>

//             <button className="hidden md:flex items-center gap-2 text-cyan-300">
//               View All
//               <FiArrowRight />
//             </button>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-8">
//             {products.map((item, i) => (
//               <div
//                 key={i}
//                 className="rounded-[32px] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-2xl hover:-translate-y-3 transition-all duration-500"
//               >
//                 <div className="h-[260px] overflow-hidden">
//                   <img
//                     src={item.image}
//                     alt={item.title}
//                     className="w-full h-full object-cover hover:scale-110 transition-all duration-700"
//                   />
//                 </div>

//                 <div className="p-8">
//                   <h3 className="text-2xl font-bold">{item.title}</h3>

//                   <p className="mt-4 text-white/50 leading-relaxed">
//                     High quality industrial chemical solutions for modern
//                     industries and laboratories.
//                   </p>

//                   <button className="mt-6 flex items-center gap-2 text-cyan-300">
//                     Learn More
//                     <FiArrowRight />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* WHY CHOOSE US */}
//       <section className="relative z-10 py-28">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid lg:grid-cols-2 gap-10">
//             <div className="rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-2xl p-10">
//               <p className="uppercase tracking-[0.3em] text-cyan-300 text-sm mb-4">
//                 Why Choose Us
//               </p>

//               <h2 className="text-5xl font-bold leading-tight">
//                 Built for
//                 <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//                   Modern Industries
//                 </span>
//               </h2>

//               <p className="mt-8 text-white/60 leading-relaxed">
//                 We deliver consistent quality, expert technical support, and
//                 reliable logistics for all industrial chemical requirements.
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-5">
//               {[
//                 "Bulk Supply",
//                 "Fast Delivery",
//                 "Certified Quality",
//                 "Technical Support",
//               ].map((item, i) => (
//                 <div
//                   key={i}
//                   className="rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl p-8 flex items-center justify-center text-center text-xl font-semibold hover:scale-105 transition-all"
//                 >
//                   {item}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* TESTIMONIALS */}
//       <section className="relative z-10 py-28">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center mb-16">
//             <p className="uppercase tracking-[0.3em] text-cyan-300 text-sm mb-4">
//               Testimonials
//             </p>

//             <h2 className="text-5xl font-bold">
//               Trusted by Clients
//             </h2>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-8">
//             {testimonials.map((item, i) => (
//               <div
//                 key={i}
//                 className="rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl p-8 hover:-translate-y-2 transition-all"
//               >
//                 <div className="flex gap-1 text-yellow-400 mb-6">
//                   {[...Array(5)].map((_, j) => (
//                     <FiStar key={j} fill="currentColor" />
//                   ))}
//                 </div>

//                 <p className="text-white/70 leading-relaxed italic">
//                   "{item.review}"
//                 </p>

//                 <div className="mt-8">
//                   <h4 className="font-bold text-lg">{item.name}</h4>
//                   <p className="text-white/40 text-sm">{item.role}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="relative z-10 pb-28">
//         <div className="max-w-5xl mx-auto px-6">
//           <div className="rounded-[40px] overflow-hidden relative bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 backdrop-blur-2xl p-14 text-center">
//             <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 blur-3xl" />

//             <div className="relative z-10">
//               <h2 className="text-5xl font-bold">
//                 Need Bulk Chemical Supply?
//               </h2>

//               <p className="mt-6 text-white/60 max-w-2xl mx-auto leading-relaxed">
//                 Contact our team today for custom quotations, technical
//                 specifications, and industrial-grade chemical solutions.
//               </p>

//               <button className="mt-10 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold hover:scale-105 transition-all inline-flex items-center gap-2">
//                 Get Quotation
//                 <FiArrowRight />
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

