import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile } from '../store/slices/authSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Vietnam',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) dispatch(getProfile());
  }, [dispatch, user]);

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      zipCode: user.address?.zipCode || '',
      country: user.address?.country || 'Vietnam',
    }));
  }, [user]);

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');

    if (form.password && form.password !== form.confirmPassword) {
      setMessage('Password confirmation does not match.');
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: {
        street: form.street,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        country: form.country,
      },
    };
    if (form.password) payload.password = form.password;

    const result = await dispatch(updateProfile(payload));
    if (result.meta.requestStatus === 'fulfilled') {
      setMessage('Profile updated successfully.');
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    }
  };

  return (
    <>
      <Navbar />
      <main className="auth-shell max-w-3xl">
        <div className="auth-card">
          <h1>My Profile</h1>
          {loading ? <Loader /> : null}
          {error ? <Message variant="error">{error}</Message> : null}
          {message ? <Message variant="info">{message}</Message> : null}

          <form onSubmit={submitHandler} className="mt-4 space-y-4">
            <input className="input" value={form.name} onChange={(e) => onChange('name', e.target.value)} placeholder="Name" required />
            <input className="input" value={form.email} onChange={(e) => onChange('email', e.target.value)} placeholder="Email" type="email" required />
            <input className="input" value={form.phone} onChange={(e) => onChange('phone', e.target.value)} placeholder="Phone" required />
            <input className="input" value={form.street} onChange={(e) => onChange('street', e.target.value)} placeholder="Street" required />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input className="input" value={form.city} onChange={(e) => onChange('city', e.target.value)} placeholder="City" required />
              <input className="input" value={form.state} onChange={(e) => onChange('state', e.target.value)} placeholder="State" required />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input className="input" value={form.zipCode} onChange={(e) => onChange('zipCode', e.target.value)} placeholder="Zip code" required />
              <input className="input" value={form.country} onChange={(e) => onChange('country', e.target.value)} placeholder="Country" required />
            </div>

            <hr className="border-slate-200" />

            <input className="input" value={form.password} onChange={(e) => onChange('password', e.target.value)} placeholder="New Password" type="password" />
            <input className="input" value={form.confirmPassword} onChange={(e) => onChange('confirmPassword', e.target.value)} placeholder="Confirm Password" type="password" />

            <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
              Update Profile
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
