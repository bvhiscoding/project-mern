import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderService from "../../services/orderService";

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, thunkAPI) => {
    try {
      return await orderService.createOrder(orderData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getMyOrders = createAsyncThunk(
  "orders/getMyOrders",
  async (_, thunkAPI) => {
    try {
      return await orderService.getMyOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getOrderById = createAsyncThunk(
  "orders/getOrderById",
  async (id, thunkAPI) => {
    try {
      return await orderService.getOrderById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const payOrder = createAsyncThunk(
  "orders/payOrder",
  async ({ orderId, paymentResult }, thunkAPI) => {
    try {
      return await orderService.payOrder(orderId, paymentResult);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getAllOrders = createAsyncThunk(
  "orders/getAllOrders",
  async (_, thunkAPI) => {
    try {
      return await orderService.getAllOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const deliverOrder = createAsyncThunk(
  "orders/deliverOrder",
  async (orderId, thunkAPI) => {
    try {
      return await orderService.deliverOrder(orderId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCurrentOrder(state) {
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
        state.orders = [action.payload, ...state.orders];
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
      })
      .addCase(payOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deliverOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(deliverOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentOrder } = orderSlice.actions;

export default orderSlice.reducer;
