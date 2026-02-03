import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { FaMinus, FaPlus, FaTrash, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalItems, totalPrice } = useSelector(state => state.cart);

  const handleUpdateQuantity = (dishId, newQuantity) => {
    dispatch(updateQuantity({ dishId, quantity: newQuantity }));
  };

  const handleRemoveItem = (dishId, dishName) => {
    if (window.confirm(`Remove ${dishName} from cart?`)) {
      dispatch(removeFromCart(dishId));
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Clear all items from cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-[#f3e0b8] text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-[#2b1e18] mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-[#6d5b51] mb-8 text-lg">
            Looks like you haven't added any dishes yet. Explore our restaurants and find something delicious!
          </p>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 bg-[#b1452a] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#8f3721] transition shadow-md"
          >
            <FaShoppingBag />
            Browse Restaurants
          </Link>
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
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#5a463d] hover:text-[#8f3721] transition-colors font-semibold"
            >
              <FaArrowLeft />
              <span>Continue Shopping</span>
            </button>
            
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-[#8f3721] hover:text-[#b1452a] font-semibold flex items-center gap-2"
              >
                <FaTrash />
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-[#2b1e18] mb-2">
              Your Cart
            </h1>
            <p className="text-[#6d5b51] mb-6">
              Ordering from: <span className="font-semibold text-[#8f3721]">{restaurantName}</span>
            </p>

            {/* Items List */}
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item.dishId}
                  className="bg-white/90 border border-[#eadfce] rounded-2xl p-4 flex gap-4 hover:shadow-md transition"
                >
                  {/* Item Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[#2b1e18] mb-1 truncate">
                      {item.name}
                    </h3>
                    <p className="text-[#8f3721] font-semibold text-lg mb-3">
                      {item.price.toLocaleString('vi-VN')} VNĐ
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 border border-[#eadfce] rounded-xl overflow-hidden">
                        <button
                          onClick={() => handleUpdateQuantity(item.dishId, item.quantity - 1)}
                          className="px-3 py-2 bg-[#fff4e6] hover:bg-[#f3e0b8] text-[#8f3721] transition"
                        >
                          <FaMinus className="text-sm" />
                        </button>
                        
                        <span className="px-4 font-semibold text-[#2b1e18] min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleUpdateQuantity(item.dishId, item.quantity + 1)}
                          className="px-3 py-2 bg-[#fff4e6] hover:bg-[#f3e0b8] text-[#8f3721] transition"
                        >
                          <FaPlus className="text-sm" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.dishId, item.name)}
                        className="text-[#8f3721] hover:text-[#b1452a] p-2"
                        title="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {/* Item Total Price */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm text-[#6d5b51] mb-1">Subtotal</p>
                    <p className="text-xl font-bold text-[#2b1e18]">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 border border-[#eadfce] rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-[#2b1e18] mb-6">
                Order Summary
              </h2>

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#6d5b51]">
                  <span>Total Items:</span>
                  <span className="font-semibold">{totalItems}</span>
                </div>
                
                <div className="flex justify-between text-[#6d5b51]">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    {totalPrice.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>

                <div className="flex justify-between text-[#6d5b51]">
                  <span>Delivery Fee:</span>
                  <span className="font-semibold">Free</span>
                </div>

                <div className="border-t border-[#eadfce] pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#2b1e18]">Total:</span>
                    <span className="text-2xl font-bold text-[#8f3721]">
                      {totalPrice.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#b1452a] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#8f3721] transition shadow-md"
              >
                Proceed to Checkout
              </button>

              {/* Additional Info */}
              <p className="text-xs text-[#6d5b51] text-center mt-4">
                Secure checkout powered by Foodeli
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
