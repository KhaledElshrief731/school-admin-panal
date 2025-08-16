import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types for Trip Group API response
export interface TripGroupStudentUser {
  id: string;
  userName: string;
  image: string;
  region: string;
  phone: string;
}

export interface TripGroupStudentSchool {
  id: string;
  name: string;
  nameEn: string;
}

export interface TripGroupStudent {
  student: {
    id: string;
    user: TripGroupStudentUser;
    school: TripGroupStudentSchool;
  };
}

export interface TripGroupDriverUser {
  id: string;
  userName: string;
  image: string;
  phone: string;
}

export interface TripGroupDriver {
  id: string;
  user: TripGroupDriverUser;
}

export interface TripGroup {
  id: string;
  name: string;
  driverId: string;
  groupType: string;
  onGoing: string;
  inComing: string;
  gender: string;
  academicLevel: string;
  isCompleted: boolean;
  holidays: string[];
  totalNumberOfStudents: number;
  remainingSeats: number;
  tripWay: string;
  lessKmPrice: number | null;
  lessStudentFee: number | null;
  NextTripType: string;
  createdAt: string;
  updatedAt: string;
  driver: TripGroupDriver;
  groupStudents: TripGroupStudent[];
}

export interface TripGroupsState {
  tripGroups: TripGroup[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  selectedTripGroup: TripGroup | null;
  selectedTripGroupLoading: boolean;
  selectedTripGroupError: string | null;
}

const initialState: TripGroupsState = {
  tripGroups: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPages: 0,
  selectedTripGroup: null,
  selectedTripGroupLoading: false,
  selectedTripGroupError: null,
};

export const fetchTripGroups = createAsyncThunk(
  'tripGroups/fetchTripGroups',
  async (
    params: {
      page?: number;
      pageSize?: number;
      driverName?: string;
      groupType?: string;
      name?: string;
      isCompleted?: string;
      gender?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      const {
        page = 1,
        pageSize = 10,
        driverName,
        groupType,
        name,
        isCompleted,
        gender,
      } = params || {};
      const response = await axios.get('https://mahfouzapp.com/dashboard/trip-groups', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        params: {
          page,
          pageSize,
          driverName,
          groupType,
          name,
          isCompleted,
          gender,
        },
      });
      if (response.data.code === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message?.english || 'Failed to fetch trip groups');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to fetch trip groups');
    }
  }
);

export const fetchTripGroupById = createAsyncThunk(
  'tripGroups/fetchTripGroupById',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://mahfouzapp.com/dashboard/trip-groups/${id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message?.english || 'Failed to fetch trip group');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to fetch trip group');
    }
  }
);

const tripSlice = createSlice({
  name: 'tripGroups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTripGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTripGroups.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.tripGroups = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTripGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Single group by ID
      .addCase(fetchTripGroupById.pending, (state) => {
        state.selectedTripGroupLoading = true;
        state.selectedTripGroupError = null;
        state.selectedTripGroup = null;
      })
      .addCase(fetchTripGroupById.fulfilled, (state, action: PayloadAction<TripGroup>) => {
        state.selectedTripGroupLoading = false;
        state.selectedTripGroup = action.payload;
      })
      .addCase(fetchTripGroupById.rejected, (state, action) => {
        state.selectedTripGroupLoading = false;
        state.selectedTripGroupError = action.payload as string;
      });
  },
});

export default tripSlice.reducer;
