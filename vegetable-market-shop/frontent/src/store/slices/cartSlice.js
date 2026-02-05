import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  itemsCount: 0,
  totalPrice: 0,
};

const calculateTotals = (items) => {
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  return { itemsCount, totalPrice };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const exist = state.items.find((x) => x.product === item.product);

      if (exist) {
        state.items = state.items.map((x) =>
          x.product === exist.product ? { ...x, quantity: x.quantity + item.quantity } : x
        );
      } else {
        state.items.push(item);
      }

      const totals = calculateTotals(state.items);
      state.itemsCount = totals.itemsCount;
      state.totalPrice = totals.totalPrice;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((x) => x.product !== action.payload);
      const totals = calculateTotals(state.items);
      state.itemsCount = totals.itemsCount;
      state.totalPrice = totals.totalPrice;
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      state.items = state.items.map((x) =>
        x.product === productId ? { ...x, quantity } : x
      );
      const totals = calculateTotals(state.items);
      state.itemsCount = totals.itemsCount;
      state.totalPrice = totals.totalPrice;
    },
    clearCart: (state) => {
      state.items = [];
      state.itemsCount = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
