import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types for Trip API response
export interface TripStatusLog {
  status: string;
  createdAt: string;
}

export interface TripStudent {
  id: string;
  tripId: string;
  studentId: string;
  type: string;
  driverId: string;
  tripGroupId: string;
  statusLog: TripStatusLog[];
  createdAt: string;
  updatedAt: string;
}

export interface TripDriverUser {
  userName: string;
  image: string;
  phone: string;
}

export interface TripDriver {
  id: string;
  user: TripDriverUser;
}

export interface TripGroupSummary {
  id: string;
  name: string;
}

export interface Trip {
  id: string;
  tripGroupId: string;
  driverId: string;
  status: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  driver: TripDriver;
  tripGroup: TripGroupSummary;
  tripStudents: TripStudent[];
}

export interface TripsState {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  selectedTrip: Trip | null;
  selectedTripLoading: boolean;
  selectedTripError: string | null;
}

const initialState: TripsState = {
  trips: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPages: 0,
  selectedTrip: null,
  selectedTripLoading: false,
  selectedTripError: null,
};

export const fetchTrips = createAsyncThunk(
  'trips/fetchTrips',
  async (
    params: {
      page?: number;
      pageSize?: number;
      groupName?: string;
      status?: string;
      date?: string;
      driverName?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      const {
        page = 1,
        pageSize = 10,
        groupName,
        status,
        date,
        driverName,
      } = params || {};
      const response = await axios.get('https://mahfouzapp.com/dashboard/trips', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        params: {
          page,
          pageSize,
          groupName,
          status,
          date,
          driverName,
        },
      });
      if (response.data.code === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message?.english || 'Failed to fetch trips');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to fetch trips');
    }
  }
);

export const fetchTripById = createAsyncThunk(
  'trips/fetchTripById',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://mahfouzapp.com/dashboard/trips/${id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message?.english || 'Failed to fetch trip');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to fetch trip');
    }
  }
);

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.trips = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Single trip by ID
      .addCase(fetchTripById.pending, (state) => {
        state.selectedTripLoading = true;
        state.selectedTripError = null;
        state.selectedTrip = null;
      })
      .addCase(fetchTripById.fulfilled, (state, action: PayloadAction<Trip>) => {
        state.selectedTripLoading = false;
        state.selectedTrip = action.payload;
      })
      .addCase(fetchTripById.rejected, (state, action) => {
        state.selectedTripLoading = false;
        state.selectedTripError = action.payload as string;
      });
  },
});

export default tripsSlice.reducer;
