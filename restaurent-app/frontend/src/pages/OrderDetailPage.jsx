import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, cancelOrder, clearSelectedOrder } from '../store/slices/orderSlice';
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaStickyNote, FaReceipt, FaCreditCard } from 'react-icons/fa';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedOrder, isLoading, isError, message } = useSelector(state => state.order);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }

    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [dispatch, id]);

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await dispatch(cancelOrder(id)).unwrap();
      } catch {
        // Error handled by toast in orderSlice
      }
    }
  };

  // Status styling
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

  // Status timeline
  const statusTimeline = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'delivering', label: 'On the Way' },
    { key: 'completed', label: 'Delivered' },
  ];

  const getStatusIndex = (status) => {
    return statusTimeline.findIndex(s => s.key === status);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#b1452a] mx-auto mb-4"></div>
          <p className="text-[#6d5b51]">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !selectedOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-[#8f3721] text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-[#2b1e18] mb-2">Order Not Found</h2>
          <p className="text-[#6d5b51] mb-6">{message || 'Unable to load order details'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-[#b1452a] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#8f3721] transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const order = selectedOrder;
  const currentStatusIndex = getStatusIndex(order.status);
  const canCancel = order.status === 'pending' || order.status === 'confirmed';

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="border-b border-[#eadfce] bg-white/70 backdrop-blur">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-[#5a463d] hover:text-[#8f3721] transition-colors font-semibold mb-4"
          >
            <FaArrowLeft />
            <span>Back to Orders</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2b1e18]">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-[#6d5b51] mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <span className={`px-6 py-3 rounded-full text-lg font-semibold border ${getStatusStyle(order.status)}`}>
              {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            {order.status !== 'cancelled' && (
              <div className="bg-white/90 border border-[#eadfce] rounded-2xl p-6">
                <h2 className="text-xl font-bold text-[#2b1e18] mb-6">Order Progress</h2>
                <div className="relative">
                  {statusTimeline.map((status, index) => {
                    const isActive = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    
                    return (
                      <div key={status.key} className="flex items-center mb-6 last:mb-0">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          isActive 
                            ? 'bg-[#b1452a] border-[#b1452a] text-white' 
                            : 'bg-white border-[#eadfce] text-[#6d5b51]'
                        }`}>
                          {isActive ? '✓' : index + 1}
                        </div>
                        <div className="ml-4 flex-1">
                          <p className={`font-semibold ${isActive ? 'text-[#2b1e18]' : 'text-[#6d5b51]'}`}>
                            {status.label}
                          </p>
                          {isCurrent && (
                            <p className="text-sm text-[#8f3721]">Current Status</p>
                          )}
                        </div>
                        {index < statusTimeline.length - 1 && (
                          <div className={`absolute left-5 w-0.5 h-8 ${
                            isActive ? 'bg-[#b1452a]' : 'bg-[#eadfce]'
                          }`} style={{ top: `${(index + 1) * 80}px` }}></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white/90 border border-[#eadfce] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-[#2b1e18] mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b border-[#eadfce] last:border-0 last:pb-0">
                    <img
                      src={item.image || `https://via.placeholder.com/100x100?text=${encodeURIComponent(item.name)}`}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-[#2b1e18]">{item.name}</h3>
                      <p className="text-sm text-[#6d5b51]">Quantity: {item.quantity}</p>
                      <p className="text-[#8f3721] font-semibold">
                        {item.price.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#2b1e18]">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white/90 border border-[#eadfce] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-[#2b1e18] mb-4">Delivery Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-[#8f3721] text-xl mt-1" />
                  <div>
                    <p className="text-sm text-[#6d5b51] mb-1">Address</p>
                    <p className="text-[#2b1e18] font-semibold">{order.deliveryAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaPhone className="text-[#8f3721] text-xl mt-1" />
                  <div>
                    <p className="text-sm text-[#6d5b51] mb-1">Phone</p>
                    <p className="text-[#2b1e18] font-semibold">{order.phone}</p>
                  </div>
                </div>
                {order.note && (
                  <div className="flex items-start gap-3">
                    <FaStickyNote className="text-[#8f3721] text-xl mt-1" />
                    <div>
                      <p className="text-sm text-[#6d5b51] mb-1">Note</p>
                      <p className="text-[#2b1e18]">{order.note}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white/90 border border-[#eadfce] rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#2b1e18] mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#eadfce]">
                  <FaReceipt className="text-[#8f3721]" />
                  <div className="flex-1">
                    <p className="text-sm text-[#6d5b51]">Restaurant</p>
                    <p className="font-semibold text-[#2b1e18]">{order.restaurant?.name || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pb-3 border-b border-[#eadfce]">
                  <FaCreditCard className="text-[#8f3721]" />
                  <div className="flex-1">
                    <p className="text-sm text-[#6d5b51]">Payment Method</p>
                    <p className="font-semibold text-[#2b1e18] capitalize">
                      {order.paymentMethod || 'Cash'}
                    </p>
                  </div>
                </div>

                <div className="pt-3">
                  <div className="flex justify-between text-[#6d5b51] mb-2">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{order.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="flex justify-between text-[#6d5b51] mb-3">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#eadfce]">
                    <span className="text-lg font-bold text-[#2b1e18]">Total:</span>
                    <span className="text-2xl font-bold text-[#8f3721]">
                      {order.totalPrice.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>
              </div>

              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  className="w-full bg-[#8f3721] text-white py-3 rounded-xl font-semibold hover:bg-[#b1452a] transition mt-4"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
