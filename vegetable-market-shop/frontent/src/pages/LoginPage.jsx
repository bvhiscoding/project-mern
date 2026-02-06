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
    if (user) navigate(redirect);
  }, [user, navigate, redirect]);

  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <>
      <Navbar />
      <main className="container-page max-w-lg">
        <div className="card p-6">
          <h1>Login</h1>
          {error ? <Message variant="error">{error}</Message> : null}
          {loading ? <Loader /> : null}

          <form onSubmit={submitHandler} className="mt-4 space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              Login
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-600">
            New Customer? <Link to="/register">Register</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
