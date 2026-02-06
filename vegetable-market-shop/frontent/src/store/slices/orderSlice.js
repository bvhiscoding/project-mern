import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk('orders/createOrder', async (payload, thunkAPI) => {
  try {
    return await orderService.createOrder(payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const getMyOrders = createAsyncThunk('orders/getMyOrders', async (_, thunkAPI) => {
  try {
    return await orderService.getMyOrders();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const getOrderById = createAsyncThunk('orders/getOrderById', async (id, thunkAPI) => {
  try {
    return await orderService.getOrderById(id);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
