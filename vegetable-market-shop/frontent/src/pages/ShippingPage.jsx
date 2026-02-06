import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ShippingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'Vietnam',
  });

  useEffect(() => {
    const saved = localStorage.getItem('shippingAddress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
      } catch (err) {
        // ignore invalid local value
      }
    }
  }, []);

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem('shippingAddress', JSON.stringify(form));
    navigate('/payment');
  };

  return (
    <>
      <Navbar />
      <main className="container-page max-w-2xl">
        <div className="card p-6">
          <h1>Shipping Address</h1>
          <form onSubmit={submitHandler} className="mt-4 space-y-4">
            <input className="input" value={form.address} onChange={(e) => onChange('address', e.target.value)} placeholder="Address" required />
            <input className="input" value={form.city} onChange={(e) => onChange('city', e.target.value)} placeholder="City" required />
            <input className="input" value={form.postalCode} onChange={(e) => onChange('postalCode', e.target.value)} placeholder="Postal Code" required />
            <input className="input" value={form.country} onChange={(e) => onChange('country', e.target.value)} placeholder="Country" required />
            <button type="submit" className="btn-primary w-full sm:w-auto">
              Continue to Payment
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
