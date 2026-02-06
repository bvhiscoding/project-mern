import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const [productsRes, ordersRes] = await Promise.all([
          productService.getProducts({ page: 1 }),
          orderService.getAllOrders(),
        ]);

        const orders = ordersRes || [];
        const users = new Set(orders.map((o) => o.user?._id).filter(Boolean));
        const revenue = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

        const totalProducts = (productsRes.products?.length || 0) +
          Math.max(0, (productsRes.pages || 1) - 1) * 10;

        setStats({
          totalProducts,
          totalOrders: orders.length,
          totalUsers: users.size,
          totalRevenue: revenue,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        <h1>Admin Dashboard</h1>
        {loading ? <Loader /> : null}
        {error ? <Message variant="error">{error}</Message> : null}

        {!loading && !error ? (
          <>
            <section
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <article style={{ border: '1px solid #ddd', padding: 12 }}>
                <p>Total Products</p>
                <h2>{stats.totalProducts}</h2>
              </article>
              <article style={{ border: '1px solid #ddd', padding: 12 }}>
                <p>Total Orders</p>
                <h2>{stats.totalOrders}</h2>
              </article>
              <article style={{ border: '1px solid #ddd', padding: 12 }}>
                <p>Total Users</p>
                <h2>{stats.totalUsers}</h2>
              </article>
              <article style={{ border: '1px solid #ddd', padding: 12 }}>
                <p>Total Revenue</p>
                <h2>{stats.totalRevenue.toLocaleString()} VND</h2>
              </article>
            </section>

            <section style={{ marginBottom: 16 }}>
              <h2>Quick Actions</h2>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link to="/admin/products/create">Add Product</Link>
                <Link to="/admin/products">Manage Products</Link>
                <Link to="/admin/orders">Manage Orders</Link>
              </div>
            </section>

            <section>
              <h2>Recent Orders</h2>
              {recentOrders.length === 0 ? (
                <Message variant="info">No recent orders.</Message>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th align="left">ID</th>
                      <th align="left">User</th>
                      <th align="left">Date</th>
                      <th align="left">Total</th>
                      <th align="left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id} style={{ borderTop: '1px solid #ddd' }}>
                        <td>{order._id.slice(-8)}</td>
                        <td>{order.user?.name || '-'}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>{Number(order.totalPrice || 0).toLocaleString()} VND</td>
                        <td>{order.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
