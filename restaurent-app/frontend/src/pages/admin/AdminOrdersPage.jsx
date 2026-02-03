import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/orderSlice';

const statusOptions = ['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled'];

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (id, status) => {
    dispatch(updateOrderStatus({ id, status }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/90 border border-[#eadfce] rounded-3xl p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-[#8f3721] font-semibold">Orders</p>
        <h1 className="text-2xl font-bold text-[#2b1e18] mt-2">Order Management</h1>
        <p className="text-sm text-[#6d5b51] mt-2">Update statuses and track delivery performance.</p>
      </div>

      <div className="bg-white/90 border border-[#eadfce] rounded-3xl p-6 shadow-sm">
        {isLoading ? (
          <p className="text-sm text-[#6d5b51]">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-[#6d5b51]">No orders available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6d5b51]">
                  <th className="py-2">Order</th>
                  <th className="py-2">Customer</th>
                  <th className="py-2">Restaurant</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Payment</th>
                  <th className="py-2 text-right">Total</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-[#eadfce]">
                    <td className="py-3 font-semibold text-[#2b1e18]">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="py-3 text-[#5a463d]">{order.user?.name || 'Guest'}</td>
                    <td className="py-3 text-[#5a463d]">{order.restaurant?.name || 'N/A'}</td>
                    <td className="py-3">
                      <select
                        value={order.status}
                        onChange={(event) => handleStatusChange(order._id, event.target.value)}
                        className="px-3 py-2 rounded-xl border border-[#eadfce] bg-white text-sm focus:ring-2 focus:ring-[#d4a373]"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 text-[#5a463d] capitalize">
                      {order.paymentMethod} / {order.paymentStatus}
                    </td>
                    <td className="py-3 text-right text-[#2b1e18] font-semibold">
                      {order.totalPrice?.toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/orders/${order._id}`}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#eadfce] text-xs font-semibold text-[#3c2f2a] hover:bg-[#fff4e6]"
                      >
                        View <FaExternalLinkAlt />
                      </Link>
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

export default AdminOrdersPage;
