import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { servicesAPI } from '../../services/api';

// 异步操作：获取所有服务
export const fetchServices = createAsyncThunk(
  'services/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await servicesAPI.getServices(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取服务列表失败');
    }
  }
);

// 异步操作：获取单个服务
export const fetchServiceById = createAsyncThunk(
  'services/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await servicesAPI.getServiceById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取服务详情失败');
    }
  }
);

// 异步操作：创建服务
export const createNewService = createAsyncThunk(
  'services/create',
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await servicesAPI.createService(serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '创建服务失败');
    }
  }
);

// 异步操作：更新服务
export const updateExistingService = createAsyncThunk(
  'services/update',
  async ({ id, ...serviceData }, { rejectWithValue }) => {
    try {
      const response = await servicesAPI.updateService(id, serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '更新服务失败');
    }
  }
);

// 异步操作：删除服务
export const deleteExistingService = createAsyncThunk(
  'services/delete',
  async (id, { rejectWithValue }) => {
    try {
      await servicesAPI.deleteService(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '删除服务失败');
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    services: [],
    currentService: null,
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
      // 获取所有服务
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.services;
        state.total = action.payload.total;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 获取单个服务
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 创建服务
      .addCase(createNewService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
        state.total += 1;
      })
      .addCase(createNewService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 更新服务
      .addCase(updateExistingService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingService.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.services.findIndex(service => service._id === action.payload._id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
        if (state.currentService && state.currentService._id === action.payload._id) {
          state.currentService = action.payload;
        }
      })
      .addCase(updateExistingService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 删除服务
      .addCase(deleteExistingService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExistingService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter(service => service._id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteExistingService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setPage, setLimit } = servicesSlice.actions;
export default servicesSlice.reducer;