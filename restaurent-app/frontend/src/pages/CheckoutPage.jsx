import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaStickyNote } from 'react-icons/fa';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const { isLoading } = useSelector(state => state.order);

  const [formData, setFormData] = useState({
    deliveryAddress: user?.address || '',
    phone: user?.phone || '',
    note: '',
    paymentMethod: 'cash'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.deliveryAddress || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const orderData = {
      items: items,
      restaurant: items[0].restaurantId,
      totalPrice: totalPrice,
      deliveryAddress: formData.deliveryAddress,
      phone: formData.phone,
      note: formData.note,
      paymentMethod: formData.paymentMethod
    };

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigate(`/orders/${result._id}`);
    } catch (error) {
      // Error already handled by toast in orderSlice
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-[#f3e0b8] text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-[#2b1e18] mb-4">Your cart is empty</h2>
          <p className="text-[#6d5b51] mb-8">Add some dishes before checking out</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-[#b1452a] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#8f3721] transition"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  const restaurantName = items[0]?.restaurantName;

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="border-b border-[#eadfce] bg-white/70 backdrop-blur">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-[#5a463d] hover:text-[#8f3721] transition-colors font-semibold"
          >
            <FaArrowLeft />
            <span>Back to Cart</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold text-[#2b1e18] mb-2">Checkout</h1>
        <p className="text-[#6d5b51] mb-8">
          Complete your order from <span className="font-semibold text-[#8f3721]">{restaurantName}</span>
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-white/90 border border-[#eadfce] rounded-2xl p-6">
                <h2 className="text-xl font-bold text-[#2b1e18] mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#8f3721]" />
                  Delivery Address
                </h2>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Enter your full delivery address"
                  className="w-full px-4 py-3 border border-[#eadfce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8f3721] text-[#2b1e18]"
                />
              </div>

              {/* Phone Number */}
              <div className="bg-white/90 border border-[#eadfce] rounded-2xl p-6">
                <h2 className="text-xl font-bold text-[#2b1e18] mb-4 flex items-center gap-2">
                  <FaPhone className="text-[#8f3721]" />
                  Contact Number
                </h2>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-[#eadfce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8f3721] text-[#2b1e18]"
                />
              </div>

              {/* Order Note */}
              <div className="bg-white/90 border border-[#eadfce] rounded-2xl p-6">
                <h2 className="text-xl font-bold text-[#2b1e18] mb-4 flex items-center gap-2">
                  <FaStickyNote className="text-[#8f3721]" />
                  Note (Optional)
                </h2>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any special requests?"
                  className="w-full px-4 py-3 border border-[#eadfce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8f3721] text-[#2b1e18]"
                />
              </div>

              {/* Payment Method */}
              <div className="bg-white/90 border border-[#eadfce] rounded-2xl p-6">
                <h2 className="text-xl font-bold text-[#2b1e18] mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {['cash', 'card', 'momo', 'zalopay'].map(method => (
                    <label key={method} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleChange}
                        className="w-5 h-5 text-[#8f3721] focus:ring-[#8f3721]"
                      />
                      <span className="text-[#2b1e18] font-medium capitalize">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#b1452a] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#8f3721] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 border border-[#eadfce] rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-[#2b1e18] mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.dishId} className="flex justify-between text-sm">
                    <span className="text-[#6d5b51]">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-semibold text-[#2b1e18]">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#eadfce] pt-4 space-y-3">
                <div className="flex justify-between text-[#6d5b51]">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="flex justify-between text-[#6d5b51]">
                  <span>Delivery Fee:</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="border-t border-[#eadfce] pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#2b1e18]">Total:</span>
                    <span className="text-2xl font-bold text-[#8f3721]">
                      {totalPrice.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
