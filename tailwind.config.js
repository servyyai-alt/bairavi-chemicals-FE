/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e6f0ff',
          100: '#b3d0ff',
          200: '#80b0ff',
          300: '#4d90ff',
          400: '#1a70ff',
          500: '#0052e0',
          600: '#0B4F9C',
          700: '#083B73',
          800: '#052649',
          900: '#020f1e',
        },
        accent: {
          green: '#22c55e',
          teal:  '#14b8a6',
          cyan:  '#06b6d4',
          gold:  '#f59e0b',
        },
        surface: {
          50:  '#f8faff',
          100: '#f0f4fe',
          200: '#e2e9fd',
          dark:  '#06091a',
          card:  '#0d1433',
          glass: 'rgba(255,255,255,0.04)',
        }
      },
      fontFamily: {
        sans:    ['"DM Sans"', 'sans-serif'],
        display: ['"Syne"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease forwards',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-left': 'slideLeft 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'glow':       'glow 3s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
        'spin-slow':  'spin 12s linear infinite',
        'shimmer':    'shimmer 1.5s infinite',
        'border-flow':'borderFlow 4s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(32px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideLeft: { from: { opacity: 0, transform: 'translateX(32px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        glow:      { '0%,100%': { boxShadow: '0 0 20px rgba(11,79,156,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(11,79,156,0.6)' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer:   { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        borderFlow:{ '0%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' }, '100%': { backgroundPosition: '0% 50%' } },
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(11,79,156,0.25)',
        'glow-md': '0 0 30px rgba(11,79,156,0.35)',
        'glow-lg': '0 0 60px rgba(11,79,156,0.45)',
        'glow-green': '0 0 30px rgba(34,197,94,0.3)',
        'card':    '0 4px 40px rgba(0,0,0,0.08)',
        'card-hover':'0 20px 60px rgba(0,0,0,0.15)',
        'dark':    '0 4px 40px rgba(0,0,0,0.5)',
        'dark-hover':'0 20px 60px rgba(0,0,0,0.7)',
      },
      backgroundImage: {
        'grid-white':    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='0.3' opacity='0.08'%3E%3Cpath d='M60 0H0v60'/%3E%3C/g%3E%3C/svg%3E\")",
        'grid-blue':     "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230B4F9C' stroke-width='0.4' opacity='0.12'%3E%3Cpath d='M60 0H0v60'/%3E%3C/g%3E%3C/svg%3E\")",
        'dot-pattern':   "radial-gradient(circle, rgba(11,79,156,0.15) 1px, transparent 1px)",
        'gradient-radial':'radial-gradient(var(--tw-gradient-stops))',
      },
      backgroundSize: {
        'grid': '60px 60px',
        'dot':  '24px 24px',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    }
  },
  plugins: []
}
