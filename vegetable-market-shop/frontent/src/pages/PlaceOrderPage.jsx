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
    } catch {
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
    if (!shippingAddress) return navigate('/shipping');
    if (!paymentMethod) return navigate('/payment');
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
      <main className="container-page space-y-4">
        <h1>Place Order</h1>
        {loading ? <Loader /> : null}
        {error ? <Message variant="error">{error}</Message> : null}
        {localError ? <Message variant="warning">{localError}</Message> : null}

        <section className="grid items-start gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            <article className="card p-4">
              <h2>Shipping</h2>
              {shippingAddress ? (
                <p className="mt-2 text-sm text-slate-700">
                  {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                  {shippingAddress.country}
                </p>
              ) : (
                <Message variant="info">No shipping address.</Message>
              )}
              <Link to="/shipping" className="mt-2 inline-block text-sm">
                Edit
              </Link>
            </article>

            <article className="card p-4">
              <h2>Payment</h2>
              <p className="mt-2 text-sm text-slate-700">{paymentMethod || 'No payment method selected.'}</p>
              <Link to="/payment" className="mt-2 inline-block text-sm">
                Edit
              </Link>
            </article>

            <article className="card p-4">
              <h2>Order Items</h2>
              {items.length === 0 ? (
                <Message variant="info">No items in cart.</Message>
              ) : (
                <div className="mt-3 space-y-3">
                  {items.map((item) => (
                    <div key={item.product} className="grid gap-3 sm:grid-cols-[80px,1fr,auto]">
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                      <div>
                        <Link to={`/product/${item.product}`} className="font-medium text-slate-900">
                          {item.name}
                        </Link>
                        <p className="text-sm text-slate-600">
                          {item.quantity} x {item.price.toLocaleString()} VND
                        </p>
                      </div>
                      <p className="text-sm font-semibold">{(item.quantity * item.price).toLocaleString()} VND</p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>

          <aside className="card p-4 lg:sticky lg:top-24">
            <h2>Summary</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>Items: {prices.itemsPrice.toLocaleString()} VND</p>
              <p>Shipping: {prices.shippingPrice.toLocaleString()} VND</p>
              <p>Tax: {prices.taxPrice.toLocaleString()} VND</p>
              <p className="pt-1 text-base font-semibold text-slate-900">
                Total: {prices.total.toLocaleString()} VND
              </p>
            </div>
            <button onClick={placeOrderHandler} disabled={items.length === 0 || loading} className="btn-primary mt-4 w-full">
              Place Order
            </button>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
