import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      return {
        items: parsed.items || [],
        totalItems: parsed.totalItems || 0,
        totalPrice: parsed.totalPrice || 0,
      };
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  };
};

// Save cart to localStorage
const saveCartToStorage = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify({
      items: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
    }));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Calculate totals
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalPrice };
};

// Initial state
const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart or increment quantity
    addToCart: (state, action) => {
      const { dishId, name, price, quantity, image, restaurantId, restaurantName } = action.payload;
      
      // Check if cart has items from a different restaurant
      if (state.items.length > 0 && state.items[0].restaurantId !== restaurantId) {
        // Clear cart automatically (confirmation will be done in component)
        state.items = [];
      }
      
      // Check if item already exists in cart
      const existingItem = state.items.find(item => item.dishId === dishId);
      
      if (existingItem) {
        // Increment quantity
        existingItem.quantity += quantity;
      } else {
        // Add new item
        state.items.push({
          dishId,
          name,
          price,
          quantity,
          image: image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(name)}`,
          restaurantId,
          restaurantName,
        });
      }
      
      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    // Remove item completely from cart
    removeFromCart: (state, action) => {
      const dishId = action.payload;
      state.items = state.items.filter(item => item.dishId !== dishId);
      
      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      
      // Save to localStorage
      saveCartToStorage(state);
      
      toast.success('Item removed from cart');
    },
    
    // Update quantity of specific item
    updateQuantity: (state, action) => {
      const { dishId, quantity } = action.payload;
      
      if (quantity < 1) {
        // Remove item if quantity is 0 or negative
        state.items = state.items.filter(item => item.dishId !== dishId);
        toast.success('Item removed from cart');
      } else {
        const item = state.items.find(item => item.dishId === dishId);
        if (item) {
          item.quantity = quantity;
        }
      }
      
      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      
      // Clear from localStorage
      localStorage.removeItem('cart');
      
      toast.success('Cart cleared');
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
