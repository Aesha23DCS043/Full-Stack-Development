import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { API_BASE } from '../utils/api';
const colors = {
  silverfox: '#b8b1a9',
  seahaze: '#b4b9ae',
  heathergray: '#a6afa3',
  bachelorblue: '#778e9b',
  oceanfloor: '#626b73',
  eveningdove: '#49505a',
};

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [roleTab, setRoleTab] = useState('user'); // 'user' | 'admin'
  const { login } = useAuth();
  const { show } = useToast();

  const ADMIN_EMAIL = 'admin@luxbath.com';
  const ADMIN_PASSWORD = 'admin@123';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Invalid email or password');
      }
      const data = await res.json();
      // Store token and user in auth context
      localStorage.setItem('token', data.token);
      login(data.token, data.user);
      // Welcome toast
      show(`Welcome back, ${data.user?.name || 'User'}!`, 'success');
      // navigate home
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/src/assets/login_image.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="bg-white/90 p-8 rounded-xl shadow-xl w-full max-w-md"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '2rem',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${colors.silverfox}`,
          maxWidth: '28rem',
          width: '100%',
        }}
      >
        <h1
          className="text-4xl font-bold text-center mb-8"
          style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '2rem',
            color: colors.eveningdove,
          }}
        >
          LuxBath
        </h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {/* Role Tabs */}
        <div className="mb-6 flex rounded-lg overflow-hidden border" style={{ borderColor: colors.seahaze }}>
          <button
            type="button"
            onClick={() => { setRoleTab('user'); }}
            className="flex-1 py-2 text-center text-sm"
            style={{ backgroundColor: roleTab === 'user' ? colors.silverfox : 'transparent', color: colors.eveningdove }}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => { setRoleTab('admin'); setEmail(ADMIN_EMAIL); }}
            className="flex-1 py-2 text-center text-sm"
            style={{ backgroundColor: roleTab === 'admin' ? colors.silverfox : 'transparent', color: colors.eveningdove, borderLeft: `1px solid ${colors.seahaze}` }}
          >
            Admin
          </button>
        </div>
        {roleTab === 'admin' && (
          <p className="text-xs mb-4" style={{ color: colors.oceanfloor }}>
            Admin email auto-filled. Enter your admin password to log in.
          </p>
        )}
        <form onSubmit={handleSubmit}
          className="space-y-6"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: colors.oceanfloor,
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{
                marginTop: '0.25rem',
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${colors.heathergray}`,
                borderRadius: '0.5rem',
                outline: 'none',
                transition: 'ring 0.2s',
              }}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => (e.target.style.boxShadow = `0 0 0 2px ${colors.bachelorblue}`)}
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: colors.oceanfloor,
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{
                marginTop: '0.25rem',
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${colors.heathergray}`,
                borderRadius: '0.5rem',
                outline: 'none',
                transition: 'ring 0.2s',
              }}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => (e.target.style.boxShadow = `0 0 0 2px ${colors.bachelorblue}`)}
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold transition-colors disabled:opacity-60"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              backgroundColor: colors.bachelorblue,
              color: 'white',
              fontWeight: '600',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              border: 'none',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = colors.oceanfloor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = colors.bachelorblue)}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          <div
            className="flex justify-between gap-4"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <a
              href="#"
              className="flex-1 py-2 text-center rounded-lg border transition-colors"
              style={{
                flex: '1',
                padding: '0.5rem',
                textAlign: 'center',
                borderRadius: '0.5rem',
                border: `1px solid ${colors.seahaze}`,
                color: colors.eveningdove,
                textDecoration: 'none',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = colors.silverfox)}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              Login with Google
            </a>
            <a
              href="#"
              className="flex-1 py-2 text-center rounded-lg border transition-colors"
              style={{
                flex: '1',
                padding: '0.5rem',
                textAlign: 'center',
                borderRadius: '0.5rem',
                border: `1px solid ${colors.seahaze}`,
                color: colors.eveningdove,
                textDecoration: 'none',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = colors.silverfox)}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              Login with Facebook
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;