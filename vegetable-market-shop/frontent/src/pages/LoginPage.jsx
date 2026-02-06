import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, login } from '../store/slices/authSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Message from '../components/Message';
import Loader from '../components/Loader';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { user, loading, error } = useSelector((state) => state.auth);
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <>
      <Navbar />

      <main style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px' }}>
        <h1>Login</h1>

        {error ? <Message variant="error">{error}</Message> : null}
        {loading ? <Loader /> : null}

        <form onSubmit={submitHandler} style={{ display: 'grid', gap: 12 }}>
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
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            Login
          </button>
        </form>

        <p style={{ marginTop: 12 }}>
          New Customer? <Link to="/register">Register</Link>
        </p>
      </main>

      <Footer />
    </>
  );
}
