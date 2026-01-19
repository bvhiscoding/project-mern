import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../store/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess || user) navigate('/dashboard');
    return () => { dispatch(reset()); };
  }, [user, isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'confirmPassword' && value !== formData.password) setPasswordError('Passwords do not match');
    else if (name === 'password' && value !== formData.confirmPassword && formData.confirmPassword) setPasswordError('Passwords do not match');
    else setPasswordError('');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setPasswordError('Passwords do not match'); return; }
    dispatch(register({ name: formData.name, email: formData.email, password: formData.password }));
  };

  const inputStyle = { width: '100%', padding: '14px 16px 14px 48px', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 15, outline: 'none', boxSizing: 'border-box' };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .reg-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        @media (max-width: 1024px) { .left-panel { display: none !important; } }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f0f9ff' }}>
        {/* Left Panel */}
        <div className="left-panel" style={{ flex: 1, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
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
            <h1 style={{ fontSize: 36, fontWeight: 700, color: 'white', marginBottom: 24, lineHeight: 1.2 }}>Join Our Healthcare Platform</h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 32, lineHeight: 1.6 }}>Create an account to access our comprehensive hospital management system.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[{ t: 'Easy Management', d: 'Manage patients effortlessly' }, { t: 'Secure & Private', d: 'Data protected with encryption' }, { t: 'Real-time Updates', d: 'Live notifications' }].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg style={{ width: 24, height: 24, color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div><h3 style={{ color: 'white', fontWeight: 600, margin: 0 }}>{item.t}</h3><p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0 }}>{item.d}</p></div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', position: 'relative', zIndex: 1 }}>© 2024 MediCare. All rights reserved.</p>
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ width: '100%', maxWidth: 440 }}>
            <div style={{ backgroundColor: 'white', borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.1)', padding: 40 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8, textAlign: 'center' }}>Create an account</h2>
              <p style={{ fontSize: 15, color: '#6b7280', textAlign: 'center', marginBottom: 32 }}>Get started with your free account</p>

              {isError && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <svg style={{ width: 20, height: 20, color: '#dc2626', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p style={{ fontSize: 14, color: '#dc2626', margin: 0 }}>{message}</p>
                </div>
              )}

              <form onSubmit={onSubmit}>
                {['name', 'email', 'password', 'confirmPassword'].map((field) => (
                  <div key={field} style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
                      {field === 'name' ? 'Full Name' : field === 'email' ? 'Email Address' : field === 'password' ? 'Password' : 'Confirm Password'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                        <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                            field === 'name' ? 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' :
                            field === 'email' ? 'M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' :
                            'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                          } />
                        </svg>
                      </span>
                      <input
                        type={field.includes('password') ? (showPassword ? 'text' : 'password') : field === 'email' ? 'email' : 'text'}
                        name={field} value={formData[field]} onChange={onChange} required className="reg-input"
                        placeholder={field === 'name' ? 'Enter your full name' : field === 'email' ? 'Enter your email' : field === 'password' ? 'Create a password' : 'Confirm your password'}
                        style={{ ...inputStyle, borderColor: field === 'confirmPassword' && passwordError ? '#fca5a5' : '#e5e7eb' }}
                      />
                      {field === 'password' && (
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}>
                          <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                          </svg>
                        </button>
                      )}
                    </div>
                    {field === 'confirmPassword' && passwordError && <p style={{ fontSize: 13, color: '#dc2626', marginTop: 6 }}>{passwordError}</p>}
                  </div>
                ))}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 24 }}>
                  <input type="checkbox" required style={{ width: 18, height: 18, marginTop: 2, accentColor: '#2563eb' }} />
                  <span style={{ fontSize: 14, color: '#4b5563' }}>I agree to the <a href="#" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Terms</a> and <a href="#" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</a></span>
                </div>

                <button type="submit" disabled={isLoading || passwordError} style={{
                  width: '100%', padding: 16, background: 'linear-gradient(90deg, #3b82f6, #2563eb)', color: 'white', border: 'none', borderRadius: 12,
                  fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: isLoading || passwordError ? 0.7 : 1
                }}>
                  {isLoading ? (<><div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Creating...</>) : 'Create account'}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: 24, fontSize: 15, color: '#6b7280' }}>
                Already have an account? <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
