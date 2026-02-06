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
      <main style={{ maxWidth: 620, margin: '0 auto', padding: '24px 16px' }}>
        <h1>Payment Method</h1>
        {error ? <Message variant="error">{error}</Message> : null}

        <form onSubmit={submitHandler} style={{ display: 'grid', gap: 10 }}>
          <label>
            <input
              type="radio"
              value="Cash on Delivery"
              checked={paymentMethod === 'Cash on Delivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />{' '}
            Cash on Delivery
          </label>
          <label>
            <input
              type="radio"
              value="PayPal"
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />{' '}
            PayPal
          </label>
          <label>
            <input
              type="radio"
              value="Credit Card"
              checked={paymentMethod === 'Credit Card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />{' '}
            Credit Card
          </label>

          <button type="submit">Continue to Place Order</button>
        </form>
      </main>
      <Footer />
    </>
  );
}
