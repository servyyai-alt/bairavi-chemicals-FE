import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    navigate(isAdmin ? '/admin/dashboard' : '/', { replace: true });
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (!res.success) return;

    const adminLogin = res.user?.role?.toLowerCase() === 'admin' || res.role?.toLowerCase() === 'admin';
    navigate(adminLogin ? '/admin/dashboard' : '/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <img src={logo} alt="Vallal Food logo" className="h-16 w-auto object-contain" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com" className="input-field" />
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={form.password} 
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••" 
                className="input-field pr-12" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" x2="22" y1="2" y2="22"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Login...' : 'Log In'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create one</Link>
          </p>
          {/* <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1">
            <p>Demo: <strong>admin@vallalfood.com</strong> / Admin@12345</p>
            <p>Demo: <strong>user@freshmart.com</strong> / user123</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { alert('Passwords do not match'); return; }
    const res = await register(form.name, form.email, form.password);
    if (res.success) navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src={logo} alt="Vallal Food logo" className="h-16 w-auto object-contain" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join thousands of happy customers</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                <input type={f.type} required value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} className="input-field" />
              </div>
            ))}

            {/* Password Field with Eye Toggle */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={form.password} 
                onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Min 6 characters" 
                className="input-field pr-12" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" x2="22" y1="2" y2="22"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Confirm Password Field with Eye Toggle */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                required 
                value={form.confirmPassword} 
                onChange={e => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Repeat password" 
                className="input-field pr-12" 
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" x2="22" y1="2" y2="22"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
