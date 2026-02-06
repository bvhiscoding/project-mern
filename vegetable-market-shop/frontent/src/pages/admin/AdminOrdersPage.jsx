import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await orderService.getAllOrders();
      setOrders(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      await loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        <h1>Manage Orders</h1>

        {loading ? <Loader /> : null}
        {error ? <Message variant="error">{error}</Message> : null}

        {!loading && !error ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">ID</th>
                <th align="left">User</th>
                <th align="left">Date</th>
                <th align="left">Total</th>
                <th align="left">Status</th>
                <th align="left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderTop: '1px solid #ddd' }}>
                  <td>{order._id.slice(-8)}</td>
                  <td>{order.user?.name || '-'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{Number(order.totalPrice || 0).toLocaleString()} VND</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <Link to={`/order/${order._id}`}>View Details</Link>
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
