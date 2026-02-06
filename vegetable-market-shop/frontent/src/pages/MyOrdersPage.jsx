import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders } from '../store/slices/orderSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function MyOrdersPage() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        <h1>My Orders</h1>

        {loading ? <Loader /> : null}
        {error ? <Message variant="error">{error}</Message> : null}

        {!loading && !error && orders.length === 0 ? (
          <Message variant="info">You have no orders yet.</Message>
        ) : null}

        {!loading && !error && orders.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">ID</th>
                <th align="left">Date</th>
                <th align="left">Total</th>
                <th align="left">Paid</th>
                <th align="left">Delivered</th>
                <th align="left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderTop: '1px solid #ddd' }}>
                  <td>{order._id.slice(-8)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{Number(order.totalPrice || 0).toLocaleString()} VND</td>
                  <td>{order.isPaid ? 'Paid' : 'Not paid'}</td>
                  <td>{order.isDelivered ? 'Delivered' : 'Pending'}</td>
                  <td>
                    <Link to={`/order/${order._id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
