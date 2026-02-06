import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function PlaceOrderPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, totalPrice } = useSelector((state) => state.cart);
  const { loading, error } = useSelector((state) => state.orders);

  const [localError, setLocalError] = useState('');

  const shippingAddress = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('shippingAddress') || 'null');
    } catch (err) {
      return null;
    }
  }, []);

  const paymentMethod = localStorage.getItem('paymentMethod') || '';

  const prices = useMemo(() => {
    const itemsPrice = Number(totalPrice || 0);
    const shippingPrice = itemsPrice >= 500 ? 0 : 30;
    const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
    const total = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
    return { itemsPrice, shippingPrice, taxPrice, total };
  }, [totalPrice]);

  const placeOrderHandler = async () => {
    setLocalError('');

    if (!shippingAddress) {
      setLocalError('Shipping address is missing.');
      return navigate('/shipping');
    }
    if (!paymentMethod) {
      setLocalError('Payment method is missing.');
      return navigate('/payment');
    }
    if (!items || items.length === 0) {
      setLocalError('Your cart is empty.');
      return;
    }

    const orderItems = items.map((item) => ({
      product: item.product,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    }));

    const result = await dispatch(
      createOrder({
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: prices.itemsPrice,
        taxPrice: prices.taxPrice,
        shippingPrice: prices.shippingPrice,
        totalPrice: prices.total,
      })
    );

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(clearCart());
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
      navigate(`/order/${result.payload._id}`);
    }
  };

  return (
    <>
      <Navbar />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        <h1>Place Order</h1>
        {loading ? <Loader /> : null}
        {error ? <Message variant="error">{error}</Message> : null}
        {localError ? <Message variant="warning">{localError}</Message> : null}

        <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div>
            <article style={{ marginBottom: 16 }}>
              <h2>Shipping</h2>
              {shippingAddress ? (
                <p>
                  {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                  {shippingAddress.country}
                </p>
              ) : (
                <Message variant="info">No shipping address.</Message>
              )}
              <Link to="/shipping">Edit</Link>
            </article>

            <article style={{ marginBottom: 16 }}>
              <h2>Payment</h2>
              <p>{paymentMethod || 'No payment method selected.'}</p>
              <Link to="/payment">Edit</Link>
            </article>

            <article>
              <h2>Order Items</h2>
              {items.length === 0 ? (
                <Message variant="info">No items in cart.</Message>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr auto',
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover' }} />
                    <div>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                      <p>
                        {item.quantity} x {item.price.toLocaleString()} VND
                      </p>
                    </div>
                    <p>{(item.quantity * item.price).toLocaleString()} VND</p>
                  </div>
                ))
              )}
            </article>
          </div>

          <aside style={{ border: '1px solid #ddd', padding: 16, height: 'fit-content' }}>
            <h2>Summary</h2>
            <p>Items: {prices.itemsPrice.toLocaleString()} VND</p>
            <p>Shipping: {prices.shippingPrice.toLocaleString()} VND</p>
            <p>Tax: {prices.taxPrice.toLocaleString()} VND</p>
            <p>
              <strong>Total: {prices.total.toLocaleString()} VND</strong>
            </p>
            <button onClick={placeOrderHandler} disabled={items.length === 0 || loading}>
              Place Order
            </button>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}
