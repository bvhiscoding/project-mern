import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../store/slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess || user) navigate('/dashboard');
    return () => { dispatch(reset()); };
  }, [user, isSuccess, navigate, dispatch]);

  const onChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const onSubmit = (e) => { e.preventDefault(); dispatch(login(formData)); };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        .login-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4); }
        @media (max-width: 1024px) { .left-panel { display: none; } .right-panel { width: 100%; } }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f0f9ff' }}>
        {/* Left Panel */}
        <div className="left-panel" style={{
          flex: 1, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', padding: 48,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 100, left: 100, width: 300, height: 300, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(60px)' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
            <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: 28, height: 28, color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>MediCare</span>
          </div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: 'white', marginBottom: 24, lineHeight: 1.2 }}>Welcome to Hospital<br />Management System</h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 32, lineHeight: 1.6 }}>
              Streamline your healthcare operations with our comprehensive management solution. Manage patients, doctors, and appointments efficiently.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[{ v: '500+', l: 'Doctors' }, { v: '10k+', l: 'Patients' }, { v: '50k+', l: 'Appointments' }].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: 'white' }}>{s.v}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', position: 'relative', zIndex: 1 }}>© 2024 MediCare. All rights reserved.</p>
        </div>

        {/* Right Panel */}
        <div className="right-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ width: '100%', maxWidth: 440 }}>
            <div style={{ backgroundColor: 'white', borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.1)', padding: 40 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8, textAlign: 'center' }}>Welcome back</h2>
              <p style={{ fontSize: 15, color: '#6b7280', textAlign: 'center', marginBottom: 32 }}>Sign in to your account to continue</p>

              {isError && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <svg style={{ width: 20, height: 20, color: '#dc2626', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p style={{ fontSize: 14, color: '#dc2626', margin: 0 }}>{message}</p>
                </div>
              )}

              <form onSubmit={onSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                      <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </span>
                    <input type="email" name="email" value={formData.email} onChange={onChange} required placeholder="Enter your email" className="login-input"
                      style={{ width: '100%', padding: '14px 16px 14px 48px', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 15, outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                      <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={onChange} required placeholder="Enter your password" className="login-input"
                      style={{ width: '100%', padding: '14px 48px 14px 48px', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 15, outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}>
                      <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>}
                      </svg>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#4b5563', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ width: 18, height: 18, accentColor: '#2563eb' }} /> Remember me
                  </label>
                  <a href="#" style={{ fontSize: 14, color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
                </div>

                <button type="submit" disabled={isLoading} className="login-btn" style={{
                  width: '100%', padding: 16, background: 'linear-gradient(90deg, #3b82f6, #2563eb)', color: 'white', border: 'none', borderRadius: 12,
                  fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: isLoading ? 0.7 : 1
                }}>
                  {isLoading ? (<><div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Signing in...</>) : 'Sign in'}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: 24, fontSize: 15, color: '#6b7280' }}>
                Don't have an account? <Link to="/register" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
