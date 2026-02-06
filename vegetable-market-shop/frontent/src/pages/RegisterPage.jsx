import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, register } from '../store/slices/authSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Message from '../components/Message';
import Loader from '../components/Loader';

const initialAddress = {
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'Vietnam',
};

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState(initialAddress);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const updateAddress = (key, value) => setAddress((prev) => ({ ...prev, [key]: value }));

  const submitHandler = (e) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    dispatch(register({ name, email, password, phone, address }));
  };

  return (
    <>
      <Navbar />
      <main className="auth-shell max-w-2xl">
        <div className="auth-card">
          <h1>Register</h1>
          {localError ? <Message variant="error">{localError}</Message> : null}
          {error ? <Message variant="error">{error}</Message> : null}
          {loading ? <Loader /> : null}

          <form onSubmit={submitHandler} className="mt-4 space-y-4">
            <div>
              <label className="label">Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div>
              <label className="label">Street</label>
              <input className="input" value={address.street} onChange={(e) => updateAddress('street', e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="label">City</label>
                <input className="input" value={address.city} onChange={(e) => updateAddress('city', e.target.value)} required />
              </div>
              <div>
                <label className="label">State</label>
                <input className="input" value={address.state} onChange={(e) => updateAddress('state', e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Zip Code</label>
                <input className="input" value={address.zipCode} onChange={(e) => updateAddress('zipCode', e.target.value)} required />
              </div>
              <div>
                <label className="label">Country</label>
                <input className="input" value={address.country} onChange={(e) => updateAddress('country', e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input
                className="input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              Register
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-600">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
