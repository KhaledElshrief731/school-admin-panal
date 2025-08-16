import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Subscription {
  id?: string;
  description: string;
  amount: number;
  currency: string;
  type: string;
  duration: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  amount: number | null;
  subscriptionId: string;
  paidStatus: string;
  method: string;
  driverId: string;
  paidAt: string | null;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    userName: string;
  };
  subscription: {
    type: string;
  };
}

export interface UserSubscriptionsDashboardResponse {
  code: number;
  message: {
    arabic: string;
    english: string;
  };
  data: UserSubscription[];
  totalPages: number;
  totalItems: number;
}

export interface UserSubscriptionsStats {
  total: number;
  monthlyTotalAmount: number;
  monthlyPendingAmount: number;
}

interface SubscriptionState {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  success: string | null;
  userSubscriptionsDashboard: UserSubscription[];
  userSubscriptionsDashboardLoading: boolean;
  userSubscriptionsDashboardError: string | null;
  userSubscriptionsDashboardTotalPages: number;
  userSubscriptionsDashboardTotalItems: number;
  userSubscriptionsStats: UserSubscriptionsStats | null;
  userSubscriptionsStatsLoading: boolean;
  userSubscriptionsStatsError: string | null;
}

const initialState: SubscriptionState = {
  subscriptions: [],
  loading: false,
  error: null,
  success: null,
  userSubscriptionsDashboard: [],
  userSubscriptionsDashboardLoading: false,
  userSubscriptionsDashboardError: null,
  userSubscriptionsDashboardTotalPages: 0,
  userSubscriptionsDashboardTotalItems: 0,
  userSubscriptionsStats: null,
  userSubscriptionsStatsLoading: false,
  userSubscriptionsStatsError: null,
};

const API_URL = 'https://mahfouzapp.com/subscription';

export const fetchSubscriptions = createAsyncThunk(
  'subscription/fetchAll',
  async () => {
      const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found in localStorage');
      const response = await axios.get('https://mahfouzapp.com/subscription', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      console.log(response.data);
      return response.data.subscriptions;
  }
);

export const createSubscription = createAsyncThunk(
  'subscription/create',
  async (subscriptionData: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_URL, subscriptionData, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      // If Prisma error, handle it
      if (response.data && response.data.code === 'P2002') {
        return rejectWithValue('A subscription with this type already exists.');
      }
      return response.data;
    } catch (error: any) {
      // Prisma error or other error
      if (error.response?.data?.code === 'P2002') {
        return rejectWithValue('A subscription with this type already exists.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create subscription');
    }
  }
);

export const fetchUserSubscriptionsDashboard = createAsyncThunk(
  'subscription/fetchUserSubscriptionsDashboard',
  async (
    {
      page = 1,
      pageSize = 20,
      userName,
      paidStatus,
      createdAtFrom,
      createdAtTo,
      updatedAtFrom,
      updatedAtTo
    }: {
      page?: number;
      pageSize?: number;
      userName?: string;
      paidStatus?: string;
      createdAtFrom?: string;
      createdAtTo?: string;
      updatedAtFrom?: string;
      updatedAtTo?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found in localStorage');
      // بناء رابط الـ API مع الباراميترز
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
      if (userName) params.append('userName', userName);
      if (paidStatus) params.append('paidStatus', paidStatus);
      if (createdAtFrom) params.append('createdAtFrom', createdAtFrom);
      if (createdAtTo) params.append('createdAtTo', createdAtTo);
      if (updatedAtFrom) params.append('updatedAtFrom', updatedAtFrom);
      if (updatedAtTo) params.append('updatedAtTo', updatedAtTo);

      const response = await axios.get(
        `https://mahfouzapp.com/user-subscriptions/dashboard?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to fetch user subscriptions dashboard');
    }
  }
);

export const fetchUserSubscriptionsStats = createAsyncThunk(
  'subscription/fetchUserSubscriptionsStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found in localStorage');
      const response = await axios.get('https://mahfouzapp.com/user-subscriptions/stat/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to fetch user subscriptions stats');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSuccess: (state) => { state.success = null; },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
        state.success = 'Fetched subscriptions successfully';
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions.push(action.payload);
        state.success = 'Subscription created successfully';
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // User Subscriptions Dashboard
      .addCase(fetchUserSubscriptionsDashboard.pending, (state) => {
        state.userSubscriptionsDashboardLoading = true;
        state.userSubscriptionsDashboardError = null;
      })
      .addCase(fetchUserSubscriptionsDashboard.fulfilled, (state, action) => {
        state.userSubscriptionsDashboardLoading = false;
        state.userSubscriptionsDashboard = action.payload.data;
        state.userSubscriptionsDashboardTotalPages = action.payload.totalPages;
        state.userSubscriptionsDashboardTotalItems = action.payload.totalItems;
      })
      .addCase(fetchUserSubscriptionsDashboard.rejected, (state, action) => {
        state.userSubscriptionsDashboardLoading = false;
        state.userSubscriptionsDashboardError = action.payload as string;
      })
      // User Subscriptions Stats
      .addCase(fetchUserSubscriptionsStats.pending, (state) => {
        state.userSubscriptionsStatsLoading = true;
        state.userSubscriptionsStatsError = null;
      })
      .addCase(fetchUserSubscriptionsStats.fulfilled, (state, action) => {
        state.userSubscriptionsStatsLoading = false;
        state.userSubscriptionsStats = action.payload;
      })
      .addCase(fetchUserSubscriptionsStats.rejected, (state, action) => {
        state.userSubscriptionsStatsLoading = false;
        state.userSubscriptionsStatsError = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
