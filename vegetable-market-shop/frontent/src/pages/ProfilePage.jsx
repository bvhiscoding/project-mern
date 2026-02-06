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
    if (!user) {
      dispatch(getProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
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
    }
  }, [user]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
        <h1>My Profile</h1>
        {loading ? <Loader /> : null}
        {error ? <Message variant="error">{error}</Message> : null}
        {message ? <Message variant="info">{message}</Message> : null}

        <form onSubmit={submitHandler} style={{ display: 'grid', gap: 12 }}>
          <input value={form.name} onChange={(e) => onChange('name', e.target.value)} placeholder="Name" required />
          <input value={form.email} onChange={(e) => onChange('email', e.target.value)} placeholder="Email" type="email" required />
          <input value={form.phone} onChange={(e) => onChange('phone', e.target.value)} placeholder="Phone" required />
          <input value={form.street} onChange={(e) => onChange('street', e.target.value)} placeholder="Street" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input value={form.city} onChange={(e) => onChange('city', e.target.value)} placeholder="City" required />
            <input value={form.state} onChange={(e) => onChange('state', e.target.value)} placeholder="State" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input value={form.zipCode} onChange={(e) => onChange('zipCode', e.target.value)} placeholder="Zip code" required />
            <input value={form.country} onChange={(e) => onChange('country', e.target.value)} placeholder="Country" required />
          </div>

          <hr />
          <input value={form.password} onChange={(e) => onChange('password', e.target.value)} placeholder="New Password" type="password" />
          <input value={form.confirmPassword} onChange={(e) => onChange('confirmPassword', e.target.value)} placeholder="Confirm Password" type="password" />

          <button type="submit" disabled={loading}>Update Profile</button>
        </form>
      </main>
      <Footer />
    </>
  );
}
