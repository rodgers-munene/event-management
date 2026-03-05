import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Loader2 } from 'lucide-react';
import { authAPI } from '../../api/index.js';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/authStore.js';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ user_email: '', password: '' });

  const change = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.user_email)                          { toast.error('Email is required'); return false; }
    if (!/\S+@\S+\.\S+/.test(form.user_email))    { toast.error('Enter a valid email'); return false; }
    if (!form.password)                            { toast.error('Password is required'); return false; }
    if (form.password.length < 8)                 { toast.error('Password must be at least 8 characters'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      if (res.data.success) {
        const { token, userDetails } = res.data;
        setAuth(userDetails, token);
        const decoded = jwtDecode(token);
        localStorage.setItem('expiresAt', (decoded.exp * 1000).toString());
        toast.success('Login successful!');
        setTimeout(() => navigate('/'), 1200);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
            <Calendar size={17} className="text-yellow-300" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">EventHub</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-7">
          <div className="mb-6">
            <p className="text-lg font-bold text-gray-900">Welcome back</p>
            <p className="text-[13px] text-gray-400 mt-0.5">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="user_email" className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                Email
              </label>
              <input
                id="user_email" type="email" name="user_email"
                placeholder="you@example.com"
                value={form.user_email} onChange={change} required
                className="w-full px-3 py-2.5 border border-gray-200 rounded text-[13px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Password
                </label>
                <a href="#reset" className="text-[11px] font-medium text-gray-400 hover:text-gray-900 transition-colors">
                  Forgot password?
                </a>
              </div>
              <input
                id="password" type="password" name="password"
                placeholder="••••••••"
                value={form.password} onChange={change} required
                className="w-full px-3 py-2.5 border border-gray-200 rounded text-[13px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? <><Loader2 size={14} className="animate-spin" /> Logging in…</> : 'Login'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[13px] text-gray-400 mt-5">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-gray-900 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;