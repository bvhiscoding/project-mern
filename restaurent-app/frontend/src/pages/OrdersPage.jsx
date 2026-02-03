import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserOrders } from '../store/slices/orderSlice';
import { FaReceipt, FaChevronRight } from 'react-icons/fa';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, isError, message } = useSelector(state => state.order);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  // Status badge styling
  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-[#fff4e6] text-[#b1452a] border-[#f3e0b8]',
      confirmed: 'bg-[#e3f2fd] text-[#1976d2] border-[#bbdefb]',
      preparing: 'bg-[#fff3e0] text-[#f57c00] border-[#ffe0b2]',
      delivering: 'bg-[#e8f5e9] text-[#388e3c] border-[#c8e6c9]',
      completed: 'bg-[#e9f3ea] text-[#3f6a4e] border-[#c8e6c9]',
      cancelled: 'bg-[#fdecec] text-[#8f3721] border-[#f5c6cb]',
    };
    return styles[status] || styles.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      preparing: '👨‍🍳',
      delivering: '🚚',
      completed: '✔️',
      cancelled: '❌',
    };
    return icons[status] || '📦';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#b1452a] mx-auto mb-4"></div>
          <p className="text-[#6d5b51]">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-[#8f3721] text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-[#2b1e18] mb-2">Error Loading Orders</h2>
          <p className="text-[#6d5b51] mb-6">{message}</p>
          <button
            onClick={() => dispatch(fetchUserOrders())}
            className="bg-[#b1452a] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#8f3721] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-[#f3e0b8] text-8xl mb-6">📦</div>
          <h2 className="text-3xl font-bold text-[#2b1e18] mb-4">No Orders Yet</h2>
          <p className="text-[#6d5b51] mb-8 text-lg">
            You haven't placed any orders. Start exploring our restaurants!
          </p>
          <Link
            to="/restaurants"
            className="inline-block bg-[#b1452a] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#8f3721] transition shadow-md"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="border-b border-[#eadfce] bg-white/70 backdrop-blur">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <h1 className="text-3xl font-bold text-[#2b1e18]">My Orders</h1>
          <p className="text-[#6d5b51] mt-1">Track and manage your orders</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block bg-white/90 border border-[#eadfce] rounded-2xl p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FaReceipt className="text-[#8f3721] text-xl" />
                    <h3 className="text-lg font-bold text-[#2b1e18]">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                  </div>
                  <p className="text-[#6d5b51] text-sm">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <FaChevronRight className="text-[#6d5b51]" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-[#6d5b51] mb-1">Restaurant</p>
                  <p className="font-semibold text-[#2b1e18]">
                    {order.restaurant?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#6d5b51] mb-1">Items</p>
                  <p className="font-semibold text-[#2b1e18]">
                    {order.items?.length || 0} item(s)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#eadfce]">
                <span className="text-sm text-[#6d5b51]">Total Amount</span>
                <span className="text-xl font-bold text-[#8f3721]">
                  {order.totalPrice?.toLocaleString('vi-VN') || 0} VNĐ
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
