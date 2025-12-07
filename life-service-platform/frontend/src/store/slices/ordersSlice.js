import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersAPI } from '../../services/api';

// 异步操作：获取所有订单
export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getUserOrders(filters);
      return { orders: response, total: response.length };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取订单列表失败');
    }
  }
);

// 异步操作：获取单个订单
export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getOrderById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取订单详情失败');
    }
  }
);

// 异步操作：创建订单
export const createNewOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.createOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '创建订单失败');
    }
  }
);

// 异步操作：更新订单
export const updateExistingOrder = createAsyncThunk(
  'orders/update',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.updateOrderStatus(id, { status });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '更新订单失败');
    }
  }
);

// 异步操作：删除订单
export const deleteExistingOrder = createAsyncThunk(
  'orders/delete',
  async (id, { rejectWithValue }) => {
    try {
      await ordersAPI.cancelOrder(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '取消订单失败');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取所有订单
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 获取单个订单
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 创建订单
      .addCase(createNewOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.total += 1;
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 更新订单
      .addCase(updateExistingOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder && state.currentOrder._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateExistingOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 删除订单
      .addCase(deleteExistingOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExistingOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order._id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteExistingOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setPage, setLimit } = ordersSlice.actions;
export default ordersSlice.reducer;