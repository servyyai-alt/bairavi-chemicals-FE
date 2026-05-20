import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiAward, FiPhone, FiCheckCircle, FiStar, FiZap } from 'react-icons/fi';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import productsHero from "../assets/products-hero.png";
import detergentImg from "../assets/detergent.png";
import industrialImg from "../assets/industrial.png";
import waterImg from "../assets/water.png";
import labImg from "../assets/lab.png";
import cleanersImg from "../assets/cleaning.png";
import solventImg from "../assets/solvents.png";
import rawImg from "../assets/raw.png";
import specialityImg from "../assets/speciality.png";
import phenylImg from "../assets/phenyl.png";
import detergentImg1 from "../assets/detergent1.png";
import dishwashImg from "../assets/dishwash.png";
import floorImg from "../assets/floor-cleaner.png";
import toiletImg from "../assets/toilet-cleaner.png";
import tilesImg from "../assets/tiles-cleaner.png";
import fabricImg from "../assets/fabric-conditioner.png";
import soapoilImg from "../assets/soap-oil.png";
import perfumedImg from "../assets/perfumed-phenyl.png";
import whyUsImg from "../assets/company.png";

/* ── Constants ────────────────────────────────────────────────────────── */
const CATEGORIES = [

{
name:"Phenyl Compound",
slug:"phenyl-compound",
image:phenylImg
},

{
name:"Detergent Liquid",
slug:"detergent-liquid",
image:detergentImg1
},

{
name:"Dishwash Liquid",
slug:"dishwash-liquid",
image:dishwashImg
},

{
name:"Floor Cleaner",
slug:"floor-cleaner",
image:floorImg
},

{
name:"Toilet Cleaner",
slug:"toilet-cleaner",
image:toiletImg
},

{
name:"Tiles Cleaner",
slug:"tiles-cleaner",
image:tilesImg
},

{
name:"Fabric Conditioner",
slug:"fabric-conditioner",
image:fabricImg
},

{
name:"Soap Oil",
slug:"soap-oil",
image:soapoilImg
},

{
name:"Perfumed Phenyl",
slug:"perfumed-phenyl",
image:perfumedImg
}

];

const STATS = [
  { value:'500+', label:'Chemical Products'},
  { value:'1,200+', label:'Happy Clients'},
  { value:'15+', label:'Years of Trust'},
  { value:'98%', label:'On-time Delivery'}
];

const FEATURES = [

{
title:"ISO Certified Quality",
desc:
"Every batch tested and supplied with proper quality assurance."
},

{
title:"Reliable Pan-India Delivery",
desc:
"Safe packaging and timely delivery across industries."
},

{
title:"Technical Support",
desc:
"Guidance on chemical selection, applications and handling."
},

{
title:"Flexible Packaging",
desc:
"Drums, bags, canisters and bulk packaging as required."
}

]

const TESTIMONIALS = [
  { name: 'Ramesh Kumar', company: 'Apex Textiles Ltd', rating: 5, initial: 'R', text: 'Consistent quality and timely delivery. Sri Bairavi is our go-to supplier for industrial chemicals.' },
  { name: 'Dr. Meena Priya', company: 'BioLab Research Institute', rating: 5, initial: 'M', text: 'Lab-grade reagents at competitive prices. Purity certificates provided with every batch — very professional.' },
  { name: 'Suresh Babu', company: 'Metro Water Works', rating: 5, initial: 'S', text: 'Their water treatment chemicals have been integral to our plant operations for 3+ years. Zero quality complaints.' },
];

const FALLBACK_CATEGORY_IMAGE = productsHero;

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
   <section className="
relative
overflow-hidden
bg-gradient-to-br
from-[#F8FCFF]
via-white
to-[#EEF7FF]
min-h-screen
flex
items-center">

{/* Background blur */}

<div className="
absolute
top-0
right-0
w-[500px]
h-[500px]
bg-blue-100
blur-[140px]
rounded-full
opacity-40"/>


<div className="
absolute
bottom-0
left-0
w-[400px]
h-[400px]
bg-green-100
blur-[120px]
rounded-full
opacity-40"/>



<div className="
max-w-7xl
mx-auto
px-6
grid
lg:grid-cols-2
gap-14
items-center">



{/* LEFT */}

<div>

<div className="
inline-flex
px-5 py-2
rounded-full
bg-green-50
border
border-green-200
text-green-700
font-medium">

Trusted Since 2009 • ISO Certified

</div>



<h1 className="
mt-8
text-6xl
lg:text-8xl
font-bold
leading-tight">

<span className="text-[#003B7A]">

Sri Bairavi

</span>

<br/>

<span className="text-[#003B7A]">

Chemical

</span>

<br/>

<span className="text-[#4E9A2D]">

Solutions

</span>

</h1>



<p className="
mt-8
text-gray-600
text-lg
leading-9
max-w-xl">

Manufacturing premium detergent
liquids, cleaning chemicals and
industrial solutions with certified
quality and bulk supply across India.

</p>



{/* Buttons */}

<div className="flex gap-5 mt-10">

{/* Request Quote */}

<Link
to="/contact"
className="
bg-[#0056A6]
text-white
px-8
py-4
rounded-xl
font-medium
hover:bg-[#00458a]
hover:scale-105
duration-300
inline-flex
items-center">

Request Quote

</Link>



{/* View Products */}

<Link
to="/products"
className="
border
border-[#0056A6]
text-[#0056A6]
px-8
py-4
rounded-xl
font-medium
hover:bg-[#0056A6]
hover:text-white
duration-300
inline-flex
items-center">

View Products

</Link>


</div>




{/* Stats */}

<div className="
flex
gap-10
mt-16
flex-wrap">


<div>

<h2 className="
text-4xl
font-bold
text-[#003B7A]">

15+

</h2>

<p className="text-gray-500">

Years Experience

</p>

</div>




<div>

<h2 className="
text-4xl
font-bold
text-[#003B7A]">

500+

</h2>

<p className="text-gray-500">

Products

</p>

</div>




<div>

<h2 className="
text-4xl
font-bold
text-[#003B7A]">

300+

</h2>

<p className="text-gray-500">

Clients

</p>

</div>



<div>

<h2 className="
text-4xl
font-bold
text-[#003B7A]">

24/7

</h2>

<p className="text-gray-500">

Support

</p>

</div>


</div>

</div>





{/* RIGHT */}

<div className="relative">


<img
src={productsHero}
alt=""
className="
w-full
object-contain
drop-shadow-2xl
animate-float"
/>



{/* Floating card */}

<div className="
absolute
top-10
left-0
bg-white
shadow-xl
rounded-2xl
px-6 py-4">

<p className="
font-semibold
text-[#003B7A]">

Premium Detergents

</p>

<p className="
text-sm
text-gray-500">

Bulk Manufacturing

</p>

</div>




<div className="
absolute
bottom-10
right-0
bg-white
shadow-xl
rounded-2xl
px-6 py-4">

<p className="
font-semibold
text-[#003B7A]">

Industrial Chemicals

</p>

<p className="
text-sm
text-gray-500">

Pan India Supply

</p>

</div>


</div>


</div>

</section>



      {/* ── CATEGORIES ──────────────────────────────────────────────── */}
     <section className="py-16 md:py-24 bg-[#F8FCFF]">

<div className="max-w-7xl mx-auto px-4 md:px-6">

{/* Heading */}

<div className="flex justify-between items-end mb-10 md:mb-14">

<div>
<p className="text-[#4E9A2D] font-medium text-sm md:text-base">
Our Products
</p>

<h2 className="
text-3xl
md:text-5xl
font-bold
text-[#003B7A]">

Browse Categories

</h2>
</div>

<Link
to="/products"
className="
text-[#0056A6]
font-medium
text-sm
md:text-base">

View All →

</Link>

</div>



{/* Cards */}

<div className="
grid
grid-cols-2
sm:grid-cols-2
md:grid-cols-3
lg:grid-cols-4
gap-4
md:gap-7">

{

categories.map((cat)=>(

<Link
key={cat._id || cat.slug}
to={`/products?category=${cat.slug}`}

className="
group
bg-white
rounded-3xl
overflow-hidden
shadow-sm
hover:shadow-2xl
duration-300
border
border-gray-100">

{/* IMAGE */}

<div className="
h-[180px]
sm:h-[220px]
md:h-[260px]
flex
items-center
justify-center
bg-[#F8FCFF]
overflow-hidden">

<img
src={cat.image || FALLBACK_CATEGORY_IMAGE}
alt={cat.name}

className="
w-full
h-full
object-contain
group-hover:scale-105
duration-500
p-2"
/>

</div>



{/* CONTENT */}

<div className="p-4 md:p-5">

<h3 className="
text-[#003B7A]
font-semibold
text-sm
md:text-xl">

{cat.name}

</h3>

<p className="
text-gray-500
text-xs
md:text-sm
mt-2">

View Products →

</p>

</div>

</Link>

))

}

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
    <section
className="
relative
overflow-hidden
py-24"

style={{
background:
"linear-gradient(135deg,#021327 0%,#003B7A 50%,#0056A6 100%)"
}}>

{/* Grid background */}

<div className="
absolute
inset-0
opacity-10
bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)]
bg-[size:40px_40px]"
/>



<div className="
max-w-7xl
mx-auto
px-6
relative
z-10">


<div className="
text-center
mb-16">

<p className="
text-green-400
font-medium">

Trusted Across Industries

</p>


<h2 className="
text-5xl
font-bold
text-white
mt-3">

Numbers Speak Quality

</h2>

</div>




<div className="
grid
grid-cols-2
md:grid-cols-4
gap-8">

{

STATS.map((item,index)=>(

<div

key={index}

className="
bg-white/5
backdrop-blur-sm
border
border-white/10
rounded-3xl
p-8
text-center
hover:-translate-y-3
duration-300
hover:border-green-400/30">



<h2 className="
text-5xl
font-bold
text-white">

{item.value}

</h2>



<div className="
w-14
h-[3px]
bg-[#4E9A2D]
mx-auto
my-5"/>



<p className="
text-gray-300
text-lg">

{item.label}

</p>


</div>

))

}

</div>

</div>

</section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────── */}
     <section
className="py-24 bg-[#F8FCFF]">

<div className="
max-w-7xl
mx-auto
px-6
grid
lg:grid-cols-2
gap-20
items-center">


{/* LEFT */}

<div>

<p className="
text-[#4E9A2D]
font-medium
mb-4">

Why Choose Us

</p>


<h2 className="
text-5xl
font-bold
text-[#003B7A]
leading-tight">

Built on Quality,
<br/>

Backed by Expertise

</h2>



<p className="
mt-8
text-gray-600
leading-8">

With years of experience,
Sri Bairavi Chemicals supplies
industrial and speciality chemicals
with quality assurance, competitive pricing
and dependable delivery.

</p>



<div className="
space-y-8
mt-10">

{

FEATURES.map((item,index)=>(

<div
key={index}
className="
border-l-4
border-[#4E9A2D]
pl-5">

<h4 className="
font-semibold
text-xl
text-[#003B7A]">

{item.title}

</h4>

<p className="
text-gray-500
mt-2">

{item.desc}

</p>

</div>

))

}

</div>




<Link
to="/contact"
className="
inline-block
mt-10
bg-[#0056A6]
text-white
px-8 py-4
rounded-xl">

Get Bulk Quotation

</Link>


</div>





{/* RIGHT IMAGE */}

<div className="relative">

<img

src={whyUsImg}

alt=""

className="
rounded-[40px]
shadow-2xl
w-full
object-cover"

/>



{/* Floating Card */}

<div className="
absolute
bottom-8
left-8
bg-white
rounded-3xl
shadow-xl
px-8 py-5">

<h3 className="
text-4xl
font-bold
text-[#003B7A]">

15+

</h3>

<p className="
text-gray-500">

Years Experience

</p>

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
