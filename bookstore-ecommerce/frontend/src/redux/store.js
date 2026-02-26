import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bookReducer from "./slices/bookSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import userReducer from "./slices/userSlice";

const loadFromStorage = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

const calculateCartTotals = (items) => {
  const itemsPrice = items.reduce((sum, item) => {
    const quantity = Number(item.quantity ?? item.qty ?? 1);
    const safeQuantity = Number.isNaN(quantity) ? 1 : quantity;
    return sum + (item.price || 0) * safeQuantity;
  }, 0);

  const shippingPrice = itemsPrice > 50 ? 0 : 6.95;
  const taxPrice = itemsPrice * 0.08;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return {
    itemsPrice: Number(itemsPrice.toFixed(2)),
    shippingPrice: Number(shippingPrice.toFixed(2)),
    taxPrice: Number(taxPrice.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2)),
  };
};

const storedUser = loadFromStorage("user", null);
const storedCartItems = loadFromStorage("cartItems", []);

const cartTotals = calculateCartTotals(storedCartItems);

const preloadedState = {
  auth: {
    user: storedUser,
    loading: false,
    error: null,
  },
  cart: {
    cartItems: storedCartItems,
    ...cartTotals,
  },
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    cart: cartReducer,
    orders: orderReducer,
    users: userReducer,
  },
  preloadedState,
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem("cartItems", JSON.stringify(state.cart.cartItems));
    if (state.auth.user) {
      localStorage.setItem("user", JSON.stringify(state.auth.user));
    } else {
      localStorage.removeItem("user");
    }
  });
}

export default store;
