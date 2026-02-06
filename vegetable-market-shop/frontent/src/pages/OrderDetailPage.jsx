import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../store/slices/orderSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function OrderDetailPage() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { currentOrder, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [dispatch, id]);

  return (
    <>
      <Navbar />

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
        <h1>Order Detail</h1>

        {loading ? <Loader /> : null}
        {error ? <Message variant="error">{error}</Message> : null}
        {!loading && !error && !currentOrder ? <Message variant="warning">Order not found.</Message> : null}

        {!loading && !error && currentOrder ? (
          <section>
            <p>
              <strong>Order ID:</strong> {currentOrder._id}
            </p>
            <p>
              <strong>Status:</strong> {currentOrder.status}
            </p>
            <p>
              <strong>Paid:</strong> {currentOrder.isPaid ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Delivered:</strong> {currentOrder.isDelivered ? 'Yes' : 'No'}
            </p>

            <h2>Shipping</h2>
            <p>
              {currentOrder.shippingAddress?.address}, {currentOrder.shippingAddress?.city},{' '}
              {currentOrder.shippingAddress?.postalCode}, {currentOrder.shippingAddress?.country}
            </p>

            <h2>Items</h2>
            {currentOrder.orderItems?.map((item) => (
              <div
                key={item._id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr auto',
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover' }} />
                <div>
                  <p>{item.name}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
                <p>{Number(item.price * item.quantity).toLocaleString()} VND</p>
              </div>
            ))}

            <h2>Summary</h2>
            <p>Items: {Number(currentOrder.itemsPrice || 0).toLocaleString()} VND</p>
            <p>Shipping: {Number(currentOrder.shippingPrice || 0).toLocaleString()} VND</p>
            <p>Tax: {Number(currentOrder.taxPrice || 0).toLocaleString()} VND</p>
            <p>
              <strong>Total: {Number(currentOrder.totalPrice || 0).toLocaleString()} VND</strong>
            </p>
          </section>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
