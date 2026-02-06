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
        const totalProducts = (productsRes.products?.length || 0) + Math.max(0, (productsRes.pages || 1) - 1) * 10;

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
      <main className="container-page space-y-4">
        <h1>Admin Dashboard</h1>
        {loading ? <Loader /> : null}
        {error ? <Message variant="error">{error}</Message> : null}

        {!loading && !error ? (
          <>
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <article className="card p-4">
                <p className="text-sm text-slate-500">Total Products</p>
                <h2 className="mt-1 text-2xl">{stats.totalProducts}</h2>
              </article>
              <article className="card p-4">
                <p className="text-sm text-slate-500">Total Orders</p>
                <h2 className="mt-1 text-2xl">{stats.totalOrders}</h2>
              </article>
              <article className="card p-4">
                <p className="text-sm text-slate-500">Total Users</p>
                <h2 className="mt-1 text-2xl">{stats.totalUsers}</h2>
              </article>
              <article className="card p-4">
                <p className="text-sm text-slate-500">Total Revenue</p>
                <h2 className="mt-1 text-2xl">{stats.totalRevenue.toLocaleString()} VND</h2>
              </article>
            </section>

            <section className="card p-4">
              <h2>Quick Actions</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link to="/admin/products/create" className="btn-primary">
                  Add Product
                </Link>
                <Link to="/admin/products" className="btn-secondary">
                  Manage Products
                </Link>
                <Link to="/admin/orders" className="btn-secondary">
                  Manage Orders
                </Link>
              </div>
            </section>

            <section className="card overflow-x-auto p-4">
              <h2>Recent Orders</h2>
              {recentOrders.length === 0 ? (
                <Message variant="info">No recent orders.</Message>
              ) : (
                <table className="mt-3 min-w-full text-sm">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-3 py-2 text-left">ID</th>
                      <th className="px-3 py-2 text-left">User</th>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Total</th>
                      <th className="px-3 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="border-t border-slate-200">
                        <td className="px-3 py-2">{order._id.slice(-8)}</td>
                        <td className="px-3 py-2">{order.user?.name || '-'}</td>
                        <td className="px-3 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-3 py-2">{Number(order.totalPrice || 0).toLocaleString()} VND</td>
                        <td className="px-3 py-2">{order.status}</td>
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
