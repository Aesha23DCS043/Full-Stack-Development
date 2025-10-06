import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const colors = {
  silverfox: '#b8b1a9',
  seahaze: '#b4b9ae',
  heathergray: '#a6afa3',
  bachelorblue: '#778e9b',
  oceanfloor: '#626b73',
  eveningdove: '#49505a',
};

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { show } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        // Auto-login immediately after successful signup
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        if (!loginRes.ok) {
          const loginErr = await loginRes.json().catch(() => ({}));
          throw new Error(loginErr.message || 'Auto-login failed, please try logging in.');
        }
        const loginData = await loginRes.json();
        localStorage.setItem('token', loginData.token);
        login(loginData.token, loginData.user);
        show(`Your account is created successfully at LuxBath. Welcome, ${loginData.user?.name || 'User'}!`, 'success');
        navigate('/');
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Server error. Please try again later.');
    }
    finally {
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
        className="bg-white/90 p-8 rounded-xl shadow-xl w-full max-w-md animate-fade-in-up"
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
          style={{ fontSize: '2.25rem', fontWeight: '700', textAlign: 'center', marginBottom: '2rem', color: colors.eveningdove }}
        >
          Create Account
        </h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium" style={{ color: colors.oceanfloor }}>Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 w-full p-3 border rounded-lg focus:outline-none"
              style={{
                marginTop: '0.25rem', width: '100%', padding: '0.75rem', border: `1px solid ${colors.heathergray}`,
                borderRadius: '0.5rem', outline: 'none'
              }}
              value={formData.name}
              onChange={handleChange}
              onFocus={(e) => (e.target.style.boxShadow = `0 0 0 2px ${colors.bachelorblue}`)}
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium" style={{ color: colors.oceanfloor }}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full p-3 border rounded-lg focus:outline-none"
              style={{
                marginTop: '0.25rem', width: '100%', padding: '0.75rem', border: `1px solid ${colors.heathergray}`,
                borderRadius: '0.5rem', outline: 'none'
              }}
              value={formData.email}
              onChange={handleChange}
              onFocus={(e) => (e.target.style.boxShadow = `0 0 0 2px ${colors.bachelorblue}`)}
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium" style={{ color: colors.oceanfloor }}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full p-3 border rounded-lg focus:outline-none"
              style={{
                marginTop: '0.25rem', width: '100%', padding: '0.75rem', border: `1px solid ${colors.heathergray}`,
                borderRadius: '0.5rem', outline: 'none'
              }}
              value={formData.password}
              onChange={handleChange}
              onFocus={(e) => (e.target.style.boxShadow = `0 0 0 2px ${colors.bachelorblue}`)}
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium" style={{ color: colors.oceanfloor }}>Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="mt-1 w-full p-3 border rounded-lg focus:outline-none"
              style={{
                marginTop: '0.25rem', width: '100%', padding: '0.75rem', border: `1px solid ${colors.heathergray}`,
                borderRadius: '0.5rem', outline: 'none'
              }}
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={(e) => (e.target.style.boxShadow = `0 0 0 2px ${colors.bachelorblue}`)}
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold transition-colors disabled:opacity-60"
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: colors.bachelorblue,
              color: 'white', fontWeight: '600', textAlign: 'center', cursor: 'pointer', border: 'none'
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = colors.oceanfloor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = colors.bachelorblue)}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;