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
      <main className="container-page space-y-4">
        <h1>My Orders</h1>

        {loading ? <Loader /> : null}
        {error ? <Message variant="error">{error}</Message> : null}
        {!loading && !error && orders.length === 0 ? (
          <Message variant="info">You have no orders yet.</Message>
        ) : null}

        {!loading && !error && orders.length > 0 ? (
            <div className="table-shell">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Delivered</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
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
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
