import { createSlice } from "@reduxjs/toolkit";

const calculateTotals = (state) => {
  const itemsPrice = state.cartItems.reduce((sum, item) => {
    const quantity = Number(item.quantity ?? item.qty ?? 1);
    const safeQuantity = Number.isNaN(quantity) ? 1 : quantity;
    return sum + (item.price || 0) * safeQuantity;
  }, 0);

  const shippingPrice = itemsPrice > 50 ? 0 : 6.95;
  const taxPrice = itemsPrice * 0.08;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  state.itemsPrice = Number(itemsPrice.toFixed(2));
  state.shippingPrice = Number(shippingPrice.toFixed(2));
  state.taxPrice = Number(taxPrice.toFixed(2));
  state.totalPrice = Number(totalPrice.toFixed(2));
};

const initialState = {
  cartItems: [],
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const itemId = item.book || item._id;
      const quantity = Number(item.quantity ?? item.qty ?? 1);
      const safeQuantity = Number.isNaN(quantity) ? 1 : quantity;

      const existing = state.cartItems.find(
        (cartItem) => (cartItem.book || cartItem._id) === itemId
      );

      if (existing) {
        existing.quantity = (existing.quantity || 1) + safeQuantity;
      } else {
        state.cartItems.push({
          ...item,
          quantity: safeQuantity,
          book: item.book || item._id,
        });
      }

      calculateTotals(state);
    },
    removeFromCart(state, action) {
      const id = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => (item.book || item._id) !== id
      );
      calculateTotals(state);
    },
    updateCartQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find(
        (cartItem) => (cartItem.book || cartItem._id) === id
      );

      if (item) {
        const safeQuantity = Math.max(1, Number(quantity) || 1);
        item.quantity = safeQuantity;
      }

      calculateTotals(state);
    },
    clearCart(state) {
      state.cartItems = [];
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
    },
    calculatePrices(state) {
      calculateTotals(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  calculatePrices,
} = cartSlice.actions;

export default cartSlice.reducer;
