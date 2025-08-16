import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Types for the API response
export interface DashboardStats {
  totalUsers: number;
  totalSchools: number;
  subscriptions: {
    paid: number;
    pending: number;
    expired: any[]; // Array of expired subscriptions
  };
}

export interface MonthlyUserData {
  month: number;
  count: number;
}

export interface MonthlySubscriptionData {
  month: number;
  paid: number;
  pending: number;
}

export interface DashboardStatsApiResponse {
  code: number;
  data: DashboardStats;
  message: {
    arabic: string;
    english: string;
  };
}

export interface MonthlyUsersApiResponse {
  code: number;
  data: MonthlyUserData[];
  message: {
    arabic: string;
    english: string;
  };
}

export interface MonthlySubscriptionsApiResponse {
  code: number;
  data: MonthlySubscriptionData[];
  message: {
    arabic: string;
    english: string;
  };
}

// State interface
interface StatsState {
  dashboardStats: DashboardStats | null;
  monthlyUsers: MonthlyUserData[];
  monthlySubscriptions: MonthlySubscriptionData[];
  loading: boolean;
  monthlyUsersLoading: boolean;
  monthlySubscriptionsLoading: boolean;
  error: string | null;
  monthlyUsersError: string | null;
  monthlySubscriptionsError: string | null;
}

// Initial state
const initialState: StatsState = {
  dashboardStats: null,
  monthlyUsers: [],
  monthlySubscriptions: [],
  loading: false,
  monthlyUsersLoading: false,
  monthlySubscriptionsLoading: false,
  error: null,
  monthlyUsersError: null,
  monthlySubscriptionsError: null,
};

// Async thunk to fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  'stats/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get<DashboardStatsApiResponse>(
        'https://mahfouzapp.com/dashboard/stats/summary',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message.english || 'Failed to fetch dashboard stats');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message?.english || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch dashboard stats';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to fetch monthly users stats
export const fetchMonthlyUsers = createAsyncThunk(
  'stats/fetchMonthlyUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get<MonthlyUsersApiResponse>(
        'https://mahfouzapp.com/dashboard/stats/monthly-users',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message.english || 'Failed to fetch monthly users stats');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message?.english || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch monthly users stats';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to fetch monthly subscriptions stats
export const fetchMonthlySubscriptions = createAsyncThunk(
  'stats/fetchMonthlySubscriptions',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get<MonthlySubscriptionsApiResponse>(
        'https://mahfouzapp.com/dashboard/stats/monthly-subscriptions',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message.english || 'Failed to fetch monthly subscriptions stats');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message?.english || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch monthly subscriptions stats';
      return rejectWithValue(errorMessage);
    }
  }
);

// Stats slice
const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    clearStatsError: (state) => {
      state.error = null;
    },
    clearStatsData: (state) => {
      state.dashboardStats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch monthly users stats
      .addCase(fetchMonthlyUsers.pending, (state) => {
        state.monthlyUsersLoading = true;
        state.monthlyUsersError = null;
      })
      .addCase(fetchMonthlyUsers.fulfilled, (state, action) => {
        state.monthlyUsersLoading = false;
        state.monthlyUsers = action.payload;
        state.monthlyUsersError = null;
      })
      .addCase(fetchMonthlyUsers.rejected, (state, action) => {
        state.monthlyUsersLoading = false;
        state.monthlyUsersError = action.payload as string;
      })
      // Fetch monthly subscriptions stats
      .addCase(fetchMonthlySubscriptions.pending, (state) => {
        state.monthlySubscriptionsLoading = true;
        state.monthlySubscriptionsError = null;
      })
      .addCase(fetchMonthlySubscriptions.fulfilled, (state, action) => {
        state.monthlySubscriptionsLoading = false;
        state.monthlySubscriptions = action.payload;
        state.monthlySubscriptionsError = null;
      })
      .addCase(fetchMonthlySubscriptions.rejected, (state, action) => {
        state.monthlySubscriptionsLoading = false;
        state.monthlySubscriptionsError = action.payload as string;
      });
  },
});

// Export actions
export const { clearStatsError, clearStatsData } = statsSlice.actions;

// Export selectors
export const selectDashboardStats = (state: { stats: StatsState }) => state.stats.dashboardStats;
export const selectStatsLoading = (state: { stats: StatsState }) => state.stats.loading;
export const selectStatsError = (state: { stats: StatsState }) => state.stats.error;
export const selectMonthlyUsers = (state: { stats: StatsState }) => state.stats.monthlyUsers;
export const selectMonthlyUsersLoading = (state: { stats: StatsState }) => state.stats.monthlyUsersLoading;
export const selectMonthlyUsersError = (state: { stats: StatsState }) => state.stats.monthlyUsersError;
export const selectMonthlySubscriptions = (state: { stats: StatsState }) => state.stats.monthlySubscriptions;
export const selectMonthlySubscriptionsLoading = (state: { stats: StatsState }) => state.stats.monthlySubscriptionsLoading;
export const selectMonthlySubscriptionsError = (state: { stats: StatsState }) => state.stats.monthlySubscriptionsError;

// Export reducer
export default statsSlice.reducer;
