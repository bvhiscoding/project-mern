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
          <div className="card overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Total</th>
                  <th className="px-3 py-2 text-left">Paid</th>
                  <th className="px-3 py-2 text-left">Delivered</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-slate-200">
                    <td className="px-3 py-2">{order._id.slice(-8)}</td>
                    <td className="px-3 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 py-2">{Number(order.totalPrice || 0).toLocaleString()} VND</td>
                    <td className="px-3 py-2">{order.isPaid ? 'Paid' : 'Not paid'}</td>
                    <td className="px-3 py-2">{order.isDelivered ? 'Delivered' : 'Pending'}</td>
                    <td className="px-3 py-2">
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
