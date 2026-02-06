import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Message from '../components/Message';

export default function PaymentPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('paymentMethod');
    if (saved) setPaymentMethod(saved);
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    setError('');
    if (!paymentMethod) {
      setError('Please choose a payment method.');
      return;
    }
    localStorage.setItem('paymentMethod', paymentMethod);
    navigate('/placeorder');
  };

  return (
    <>
      <Navbar />
      <main className="container-page max-w-2xl">
        <div className="card p-6">
          <h1>Payment Method</h1>
          {error ? <Message variant="error">{error}</Message> : null}

          <form onSubmit={submitHandler} className="mt-4 space-y-3">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 p-3">
              <input
                type="radio"
                value="Cash on Delivery"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 p-3">
              <input
                type="radio"
                value="PayPal"
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              PayPal
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 p-3">
              <input
                type="radio"
                value="Credit Card"
                checked={paymentMethod === 'Credit Card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit Card
            </label>

            <button type="submit" className="btn-primary w-full sm:w-auto">
              Continue to Place Order
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
