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

export interface NotificationByIdResponse {
  code: number;
  message: {
    arabic: string;
    english: string;
  };
  data: Notification;
}

export interface ResendNotificationResponse {
  code: number;
  message: {
    arabic: string;
    english: string;
  };
  data: any;
}

export interface RemoveNotificationResponse {
  code: number;
  message: {
    arabic: string;
    english: string;
  };
}

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;
  lastCreatedNotification: Notification | null;
  selectedNotification: Notification | null;
  selectedNotificationLoading: boolean;
  selectedNotificationError: string | null;
  resendLoading: boolean;
  resendError: string | null;
  resendSuccess: boolean;
  removeLoading: boolean;
  removeError: string | null;
  removeSuccess: boolean;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  createSuccess: false,
  lastCreatedNotification: null,
  selectedNotification: null,
  selectedNotificationLoading: false,
  selectedNotificationError: null,
  resendLoading: false,
  resendError: null,
  resendSuccess: false,
  removeLoading: false,
  removeError: null,
  removeSuccess: false,
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

// Async thunk to fetch notification by ID
export const fetchNotificationById = createAsyncThunk(
  'notifications/fetchNotificationById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<NotificationByIdResponse>(
        `/dashboard/notifications/ads/${id}`
      );

      if (response.data.code === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message.english || 'Failed to fetch notification');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message?.english || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch notification';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to resend notification
export const resendNotification = createAsyncThunk(
  'notifications/resendNotification',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.post<ResendNotificationResponse>(
        `/dashboard/notifications/resend/${id}`
      );

      if (response.data.code === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message.english || 'Failed to resend notification');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message?.english || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to resend notification';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to remove notification
export const removeNotification = createAsyncThunk(
  'notifications/removeNotification',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<RemoveNotificationResponse>(
        `/dashboard/notifications/remove/${id}`
      );

      if (response.data.code === 200) {
        return { id, response: response.data };
      } else {
        throw new Error(response.data.message.english || 'Failed to remove notification');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message?.english || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to remove notification';
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
    clearSelectedNotification: (state) => {
      state.selectedNotification = null;
      state.selectedNotificationError = null;
    },
    clearResendState: (state) => {
      state.resendLoading = false;
      state.resendError = null;
      state.resendSuccess = false;
    },
    clearRemoveState: (state) => {
      state.removeLoading = false;
      state.removeError = null;
      state.removeSuccess = false;
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
      })
      // Fetch notification by ID
      .addCase(fetchNotificationById.pending, (state) => {
        state.selectedNotificationLoading = true;
        state.selectedNotificationError = null;
      })
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.selectedNotificationLoading = false;
        state.selectedNotification = action.payload.data;
      })
      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.selectedNotificationLoading = false;
        state.selectedNotificationError = action.payload as string;
      })
      // Resend notification
      .addCase(resendNotification.pending, (state) => {
        state.resendLoading = true;
        state.resendError = null;
        state.resendSuccess = false;
      })
      .addCase(resendNotification.fulfilled, (state, action) => {
        state.resendLoading = false;
        state.resendSuccess = true;
      })
      .addCase(resendNotification.rejected, (state, action) => {
        state.resendLoading = false;
        state.resendError = action.payload as string;
        state.resendSuccess = false;
      })
      // Remove notification
      .addCase(removeNotification.pending, (state) => {
        state.removeLoading = true;
        state.removeError = null;
        state.removeSuccess = false;
      })
      .addCase(removeNotification.fulfilled, (state, action) => {
        state.removeLoading = false;
        state.removeSuccess = true;
        // Remove from notifications list
        state.notifications = state.notifications.filter(
          notification => notification.id !== action.payload.id
        );
      })
      .addCase(removeNotification.rejected, (state, action) => {
        state.removeLoading = false;
        state.removeError = action.payload as string;
        state.removeSuccess = false;
      });
  },
});

// Export actions
export const { 
  clearCreateError, 
  clearCreateSuccess, 
  clearLastCreatedNotification,
  resetCreateState,
  clearSelectedNotification,
  clearResendState,
  clearRemoveState
} = notificationsSlice.actions;

// Export selectors
export const selectNotifications = (state: { notifications: NotificationsState }) => state.notifications.notifications;
export const selectNotificationsLoading = (state: { notifications: NotificationsState }) => state.notifications.loading;
export const selectNotificationsError = (state: { notifications: NotificationsState }) => state.notifications.error;
export const selectCreateNotificationLoading = (state: { notifications: NotificationsState }) => state.notifications.createLoading;
export const selectCreateNotificationError = (state: { notifications: NotificationsState }) => state.notifications.createError;
export const selectCreateNotificationSuccess = (state: { notifications: NotificationsState }) => state.notifications.createSuccess;
export const selectLastCreatedNotification = (state: { notifications: NotificationsState }) => state.notifications.lastCreatedNotification;
export const selectSelectedNotification = (state: { notifications: NotificationsState }) => state.notifications.selectedNotification;
export const selectSelectedNotificationLoading = (state: { notifications: NotificationsState }) => state.notifications.selectedNotificationLoading;
export const selectSelectedNotificationError = (state: { notifications: NotificationsState }) => state.notifications.selectedNotificationError;
export const selectResendLoading = (state: { notifications: NotificationsState }) => state.notifications.resendLoading;
export const selectResendError = (state: { notifications: NotificationsState }) => state.notifications.resendError;
export const selectResendSuccess = (state: { notifications: NotificationsState }) => state.notifications.resendSuccess;
export const selectRemoveLoading = (state: { notifications: NotificationsState }) => state.notifications.removeLoading;
export const selectRemoveError = (state: { notifications: NotificationsState }) => state.notifications.removeError;
export const selectRemoveSuccess = (state: { notifications: NotificationsState }) => state.notifications.removeSuccess;

// Export reducer
export default notificationsSlice.reducer;