import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaHamburger, FaClipboardList, FaUsers, FaArrowRight } from 'react-icons/fa';
import restaurantService from '../../services/restaurantService';
import dishService from '../../services/dishService';
import orderService from '../../services/orderService';
import userService from '../../services/userService';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    restaurants: 0,
    dishes: 0,
    orders: 0,
    users: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const [restaurantsRes, dishesRes, ordersRes, usersRes] = await Promise.all([
          restaurantService.getAllRestaurantsAdmin(),
          dishService.getAllDishes(),
          orderService.getAllOrders(),
          userService.getAllUsers(),
        ]);

        const restaurants = restaurantsRes?.data || [];
        const dishes = dishesRes?.data || [];
        const orders = ordersRes?.data || [];
        const users = usersRes?.data || [];

        setStats({
          restaurants: restaurants.length,
          dishes: dishes.length,
          orders: orders.length,
          users: users.length,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        setRecentOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const cards = [
    {
      label: 'Restaurants',
      value: stats.restaurants,
      icon: FaUtensils,
      color: 'bg-[#b1452a]',
      link: '/admin/restaurants',
    },
    {
      label: 'Dishes',
      value: stats.dishes,
      icon: FaHamburger,
      color: 'bg-[#c9793b]',
      link: '/admin/dishes',
    },
    {
      label: 'Orders',
      value: stats.orders,
      icon: FaClipboardList,
      color: 'bg-[#2b1e18]',
      link: '/admin/orders',
    },
    {
      label: 'Users',
      value: stats.users,
      icon: FaUsers,
      color: 'bg-[#3f6a4e]',
      link: '/admin/users',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white/90 border border-[#eadfce] rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#8f3721] font-semibold">Admin overview</p>
            <h1 className="text-3xl font-bold text-[#2b1e18] mt-2">Kitchen Command Center</h1>
            <p className="text-sm text-[#6d5b51] mt-2">Monitor performance, manage inventory, and keep service flowing.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/orders"
              className="px-5 py-2 rounded-full bg-[#b1452a] text-white text-sm font-semibold hover:bg-[#8f3721]"
            >
              Review orders
            </Link>
            <Link
              to="/admin/restaurants"
              className="px-5 py-2 rounded-full border border-[#eadfce] text-sm font-semibold text-[#3c2f2a] hover:bg-[#fff4e6]"
            >
              Update restaurants
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              to={card.link}
              key={card.label}
              className="bg-white/90 border border-[#eadfce] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#5a463d]">{card.label}</p>
                  <p className="text-3xl font-bold text-[#2b1e18] mt-2">
                    {isLoading ? '...' : card.value}
                  </p>
                </div>
                <div className={`p-4 rounded-xl text-white ${card.color}`}>
                  <Icon className="text-2xl" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-white/90 border border-[#eadfce] rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#2b1e18]">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm font-semibold text-[#8f3721] flex items-center gap-2">
            View all <FaArrowRight />
          </Link>
        </div>
        {isLoading ? (
          <p className="text-sm text-[#6d5b51]">Loading orders...</p>
        ) : recentOrders.length === 0 ? (
          <p className="text-sm text-[#6d5b51]">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6d5b51]">
                  <th className="py-2">Order</th>
                  <th className="py-2">Customer</th>
                  <th className="py-2">Restaurant</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-t border-[#eadfce]">
                    <td className="py-3 font-semibold text-[#2b1e18]">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="py-3 text-[#5a463d]">{order.user?.name || 'Guest'}</td>
                    <td className="py-3 text-[#5a463d]">{order.restaurant?.name || 'N/A'}</td>
                    <td className="py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fff4e6] text-[#8f3721] capitalize">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-[#2b1e18] font-semibold">
                      {order.totalPrice?.toLocaleString('vi-VN')} VNĐ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
