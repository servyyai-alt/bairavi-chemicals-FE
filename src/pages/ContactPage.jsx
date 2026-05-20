import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    toast.success('Inquiry sent! We will get back to you within 24 hours.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setSubmitting(false);
  };

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div style={{ background: '#f8faff', minHeight: '100vh' }}>

      {/* Hero */}
      <section className="relative py-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #020f1e 0%, #083B73 60%, #0B4F9C 100%)' }}>
        <div className="absolute inset-0 bg-grid-white bg-grid" />
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)' }} />
        <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
          <span className="section-label mb-4 block justify-center">Contact Us</span>
          <h1 className="font-display text-5xl font-bold text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
            Let's Talk Chemicals
          </h1>
          <p className="text-lg" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Send us your inquiry or bulk order requirements. Our experts respond within 24 hours.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,20 C480,40 960,0 1440,20 L1440,40 L0,40 Z" fill="#f8faff" />
          </svg>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-5 gap-8">

        {/* Info column */}
        <div className="md:col-span-2 space-y-4">
          {[
            { icon: FiPhone, label: 'Phone', val: '+91 89404 48177', href: 'tel:+918940448177', color: '#0B4F9C' },
            { icon: FiMail,  label: 'Email', val: 'info@sribairavichemicals.com', href: 'mailto:info@sribairavichemicals.com', color: '#0d9488' },
            { icon: FiMapPin,label: 'Address', val: 'Sri Bairavi Chemicals, Chennai, Tamil Nadu, India', color: '#d97706' },
            { icon: FiClock, label: 'Business Hours', val: 'Mon–Sat: 9:00 AM – 6:00 PM IST', color: '#7c3aed' },
          ].map((c, i) => (
            <div key={i} className="flex gap-4 items-start p-5 rounded-3xl transition-all duration-300 group cursor-default"
              style={{ background: 'white', border: '1px solid rgba(11,79,156,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = `${c.color}25`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'rgba(11,79,156,0.07)'; }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${c.color}12`, color: c.color }}>
                <c.icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>{c.label}</p>
                {c.href
                  ? <a href={c.href} className="text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors">{c.val}</a>
                  : <p className="text-sm font-semibold text-slate-700">{c.val}</p>}
              </div>
            </div>
          ))}

          {/* WhatsApp */}
          <a href="https://wa.me/918940448177?text=Hello%20Sri%20Bairavi%20Chemicals%2C%20send%20me%20your%20product%20list."
            target="_blank" rel="noreferrer"
            className="flex items-center justify-between gap-3 p-5 rounded-3xl transition-all duration-300 group"
            style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow: '0 8px 32px rgba(34,197,94,0.3)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(34,197,94,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(34,197,94,0.3)'; }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <div>
                <div className="text-white font-bold text-sm">Chat on WhatsApp</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>Instant response during business hours</div>
              </div>
            </div>
            <FiArrowRight className="w-5 h-5 text-white transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Form */}
        <div className="md:col-span-3 p-8 rounded-3xl"
          style={{ background: 'white', border: '1px solid rgba(11,79,156,0.07)', boxShadow: '0 8px 48px rgba(0,0,0,0.06)' }}>
          <h2 className="font-display text-2xl font-bold text-slate-800 mb-2" style={{ letterSpacing: '-0.02em' }}>Send an Inquiry</h2>
          <p className="text-sm text-slate-400 mb-7">Fill out the form and our team will contact you with a detailed quote.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Name *</label>
                <input required value={form.name} onChange={f('name')} placeholder="Your full name" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Phone Number</label>
                <input value={form.phone} onChange={f('phone')} placeholder="+91 XXXXX XXXXX" className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address *</label>
              <input required type="email" value={form.email} onChange={f('email')} placeholder="your@company.com" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Subject</label>
              <input value={form.subject} onChange={f('subject')} placeholder="Bulk inquiry / Pricing / Product availability" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Message *</label>
              <textarea required rows={5} value={form.message} onChange={f('message')}
                placeholder="Describe the chemical(s) needed, quantity, grade, application, special requirements…"
                className="input-field resize-none" />
            </div>

            <button type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white transition-all duration-300 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#0B4F9C,#1a70ff)', boxShadow: '0 8px 32px rgba(11,79,156,0.3)' }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
              <FiSend className="w-4 h-4" />
              {submitting ? 'Sending your inquiry…' : 'Send Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
