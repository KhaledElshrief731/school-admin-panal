import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Types for the notification API
export interface NotificationTitle {
  ar: string;
  en: string;
  ku: string;
}

export interface NotificationDescription {
  ar: string;
  en: string;
  ku: string;
}

export interface CreateNotificationRequest {
  title: NotificationTitle;
  description: NotificationDescription;
  type: 'APP_NOTIFICATION' | 'APP_ADS';
  image?: string;
  startDate?: string; // Only for APP_ADS
  endDate?: string;   // Only for APP_ADS
}

export interface Notification {
  id: string;
  title: NotificationTitle;
  description: NotificationDescription;
  type: 'APP_NOTIFICATION' | 'APP_ADS';
  userId: string | null;
  image: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationResponse {
  code: number;
  message: {
    arabic: string;
    english: string;
  };
  data: Notification;
}

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;
  lastCreatedNotification: Notification | null;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  createSuccess: false,
  lastCreatedNotification: null,
};

// Async thunk to create notification
export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (notificationData: CreateNotificationRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<CreateNotificationResponse>(
        '/dashboard/notifications',
        notificationData
      );

      if (response.data.code === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message.english || 'Failed to create notification');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message?.english || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to create notification';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to fetch notifications (optional - for listing)
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params: { page?: number; pageSize?: number; type?: string } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, pageSize = 10, type } = params;
      const response = await api.get('/dashboard/notifications', {
        params: { page, pageSize, type }
      });

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message?.english || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch notifications';
      return rejectWithValue(errorMessage);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    clearLastCreatedNotification: (state) => {
      state.lastCreatedNotification = null;
    },
    resetCreateState: (state) => {
      state.createLoading = false;
      state.createError = null;
      state.createSuccess = false;
      state.lastCreatedNotification = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create notification
      .addCase(createNotification.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        state.lastCreatedNotification = action.payload.data;
        // Add to notifications list if it exists
        state.notifications.unshift(action.payload.data);
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
        state.createSuccess = false;
      })
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data || action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { 
  clearCreateError, 
  clearCreateSuccess, 
  clearLastCreatedNotification,
  resetCreateState 
} = notificationsSlice.actions;

// Export selectors
export const selectNotifications = (state: { notifications: NotificationsState }) => state.notifications.notifications;
export const selectNotificationsLoading = (state: { notifications: NotificationsState }) => state.notifications.loading;
export const selectNotificationsError = (state: { notifications: NotificationsState }) => state.notifications.error;
export const selectCreateNotificationLoading = (state: { notifications: NotificationsState }) => state.notifications.createLoading;
export const selectCreateNotificationError = (state: { notifications: NotificationsState }) => state.notifications.createError;
export const selectCreateNotificationSuccess = (state: { notifications: NotificationsState }) => state.notifications.createSuccess;
export const selectLastCreatedNotification = (state: { notifications: NotificationsState }) => state.notifications.lastCreatedNotification;

// Export reducer
export default notificationsSlice.reducer;