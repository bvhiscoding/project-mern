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
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const updateAddress = (key, value) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

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

    dispatch(
      register({
        name,
        email,
        password,
        phone,
        address,
      })
    );
  };

  return (
    <>
      <Navbar />

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px' }}>
        <h1>Register</h1>

        {localError ? <Message variant="error">{localError}</Message> : null}
        {error ? <Message variant="error">{error}</Message> : null}
        {loading ? <Loader /> : null}

        <form onSubmit={submitHandler} style={{ display: 'grid', gap: 12 }}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="street">Street</label>
            <input
              id="street"
              type="text"
              value={address.street}
              onChange={(e) => updateAddress('street', e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                value={address.city}
                onChange={(e) => updateAddress('city', e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                value={address.state}
                onChange={(e) => updateAddress('state', e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <label htmlFor="zipCode">Zip Code</label>
              <input
                id="zipCode"
                type="text"
                value={address.zipCode}
                onChange={(e) => updateAddress('zipCode', e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="country">Country</label>
              <input
                id="country"
                type="text"
                value={address.country}
                onChange={(e) => updateAddress('country', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            Register
          </button>
        </form>

        <p style={{ marginTop: 12 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </main>

      <Footer />
    </>
  );
}
