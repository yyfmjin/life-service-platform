import { configureStore } from '@reduxjs/toolkit';
import servicesReducer from './slices/servicesSlice';
import ordersReducer from './slices/ordersSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    services: servicesReducer,
    orders: ordersReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略action和state中的non-serializable值
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled', 'auth/logout/fulfilled'],
        ignoredPaths: ['auth.user'],
      },
    }),
});

export default store;