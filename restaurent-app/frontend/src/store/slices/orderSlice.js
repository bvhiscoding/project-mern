import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';
import toast from 'react-hot-toast';

// CREATE ORDER
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, thunkAPI) => {
    try {
      const response = await orderService.createOrder(orderData);
      toast.success('Order placed successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// FETCH USER ORDERS
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, thunkAPI) => {
    try {
      const response = await orderService.getUserOrders();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// FETCH SINGLE ORDER
export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await orderService.getOrderById(id);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// CANCEL ORDER
export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (id, thunkAPI) => {
    try {
      const response = await orderService.cancelOrder(id);
      toast.success('Order cancelled successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// FETCH ALL ORDERS (Admin)
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await orderService.getAllOrders();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// UPDATE ORDER STATUS (Admin)
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await orderService.updateOrderStatus(id, status);
      toast.success('Order status updated');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// INITIAL STATE
const initialState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearOrders: (state) => {
      state.orders = [];
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============ CREATE ORDER ============
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders.unshift(action.payload); // Add to start of array
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ============ FETCH USER ORDERS ============
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.orders = [];
      })

      // ============ FETCH ORDER BY ID ============
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ============ CANCEL ORDER ============
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Update in orders list
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        
        // Update selected order
        if (state.selectedOrder?._id === action.payload._id) {
          state.selectedOrder = action.payload;
        }
      })

      // ============ FETCH ALL ORDERS (Admin) ============
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ============ UPDATE ORDER STATUS (Admin) ============
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Update in orders list
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        
        // Update selected order
        if (state.selectedOrder?._id === action.payload._id) {
          state.selectedOrder = action.payload;
        }
      });
  },
});

export const { reset, clearOrders, clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
