import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiArrowRight, FiLinkedin, FiInstagram, FiTwitter } from 'react-icons/fi';
import logo from "../../assets/logo.jpeg"
import { getCategories } from '../../services/api';
import lalogo from "../../assets/la-logo.png"
const LINKS = [
  { label: 'Home', to: '/' }, { label: 'Products', to: '/products' },
  { label: 'Contact', to: '/contact' }, { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
];

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data.categories || []);
      } catch (error) {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  return (
    <footer style={{ background: '#06091a', color: '#94a3b8' }}>
      {/* Top CTA strip */}
      <div style={{ background: 'linear-gradient(90deg, rgba(11,79,156,0.3), rgba(34,197,94,0.15))', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display text-white font-semibold text-lg">Ready to place a bulk order?</p>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Contact us for competitive pricing and quick dispatch.</p>
          </div>
          <Link to="/contact"
            className="flex-shrink-0 flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-2xl text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#0B4F9C,#1a70ff)', boxShadow: '0 4px 20px rgba(11,79,156,0.4)' }}>
            Get Quotation <FiArrowRight />
          </Link>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-3 mb-6 w-fit">
            <div className="w-10 h-10 rounded-2xl overflow-hidden">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm">Sri Bairavi</div>
              <div className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: '#22c55e' }}>CHEMICALS</div>
            </div>
          </Link>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Your trusted partner for industrial, laboratory, and specialty chemicals. Quality assured. Delivery guaranteed.
          </p>
          {/* Socials */}
          <div className="flex gap-2">
            {[{ icon: FiLinkedin, href: '#' }, { icon: FiInstagram, href: '#' }, { icon: FiTwitter, href: '#' }].map(({ icon: Icon, href }, i) => (
              <a key={i} href={href}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-1"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0B4F9C'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#0B4F9C'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest text-[11px]">Categories</h4>
          <ul className="space-y-2.5">
            {categories.map(category => (
              <li key={category._id}>
                <Link to={`/products?category=${encodeURIComponent(category._id || category.slug || category.name)}`}
                  className="text-sm flex items-center gap-2 transition-colors hover:text-white group"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <span className="w-1 h-1 rounded-full transition-all group-hover:w-3" style={{ background: '#22c55e' }} />
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest text-[11px]">Quick Links</h4>
          <ul className="space-y-2.5">
            {LINKS.map(l => (
              <li key={l.to}>
                <Link to={l.to}
                  className="text-sm flex items-center gap-2 transition-colors hover:text-white group"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <span className="w-1 h-1 rounded-full transition-all group-hover:w-3" style={{ background: '#22c55e' }} />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest text-[11px]">Contact</h4>
          <ul className="space-y-4">
            {[
              { icon: FiMapPin, text: 'Sri Bairavi Chemicals, Chennai, Tamil Nadu, India' },
              { icon: FiPhone, text: '+91 89404 48177', href: 'tel:+918940448177' },
              { icon: FiMail, text: 'info@sribairavichemicals.com', href: 'mailto:info@sribairavichemicals.com' },
            ].map((c, i) => (
              <li key={i} className="flex items-start gap-3">
                <c.icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#22c55e' }} />
                {c.href
                  ? <a href={c.href} className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>{c.text}</a>
                  : <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{c.text}</span>
                }
              </li>
            ))}
          </ul>
          {/* Hours */}
          <div className="mt-5 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-[11px] uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Business Hours</p>
            <p className="text-sm font-semibold text-white">Mon–Sat: 9:00 AM – 6:00 PM</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © {new Date().getFullYear()} Sri Bairavi Chemicals. All rights reserved.
          </p>
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {/* Logo */}
            <img
              src={lalogo}
              alt="Least Action Company"
              className="w-8 h-8 object-contain"
            />

            <span>Design & Development by</span>

            <a
              href="https://leastactioncompany.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline transition-all text-white"
              
            >
              Least Action Company Pvt Ltd
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
