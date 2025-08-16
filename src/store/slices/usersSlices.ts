import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface User {
  id: string;
  userName: string;
  phone: string;
  image: string | null;
  role: string;
  city: { name: string; nameEn: string };
  country: { name: string; nameEn: string };
  region: string;
  dateOfBirth: string | null;
  gender: string;
  driver?: {
    modelYear: number;
    carModel: string;
    vehicleId: string;
    color: string;
    keyNumber: string;
  };
  student?: {
    AcademicLevel: 'PRIMARY' | 'SECONDARY' | 'UNIVERSITY';
    AcademicYear: string;
    schoolId: string;
  };
}

// Interfaces for different user creation request bodies
export interface CreateUserRequest {
  userName: string;
  phone: string;
  password: string;
  dateOfBirth: string;
  region: string;
  cityId: string;
  countryId: string;
  latitude?: number;
  longitude?: number;
  verifyCode?: number;
  gender: 'MALE' | 'FEMALE';
  role: 'STUDENT' | 'PARENT' | 'DRIVER';
}

export interface StudentData {
  AcademicLevel: 'PRIMARY' | 'SECONDARY' | 'UNIVERSITY';
  AcademicYear: string;
  schoolId: string;
}

export interface DriverData {
  modelYear: number;
  carModel: string;
  vehicleId: string;
  color: string;
  keyNumber: string;
}

export interface CreateStudentRequest {
  user: CreateUserRequest;
  student: StudentData;
}

export interface CreateParentRequest {
  user: CreateUserRequest;
}

export interface CreateDriverRequest {
  user: CreateUserRequest;
  driver: DriverData;
}

export type CreateUserRequestBody = CreateStudentRequest | CreateParentRequest | CreateDriverRequest;

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  createLoading: boolean;
  createError: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPages: 0,
  createLoading: false,
  createError: null,
};

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async (
    params: { 
      role?: string; 
      userName?: string; 
      isVerified?: boolean; 
      page?: number; 
      pageSize?: number; 
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      const searchParams = new URLSearchParams();
      if (params.role) searchParams.append('role', params.role);
      if (params.userName) searchParams.append('userName', params.userName);
      if (params.isVerified !== undefined) searchParams.append('isVerified', String(params.isVerified));
      const url = `https://mahfouzapp.com/dashboard-auth/get-all-users${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to fetch users');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/create',
  async (userData: CreateUserRequestBody, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://mahfouzapp.com/dashboard-auth/create-user',
        userData,
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to create user');
    }
  }
);

export const verifyUser = createAsyncThunk(
  'users/verifyUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `https://mahfouzapp.com/dashboard-auth/update-verify-user/${userId}`,
        {},
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to verify user');
    }
  }
);

export const fetchUserDriverDetails = createAsyncThunk(
  'users/fetchUserDriverDetails',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://mahfouzapp.com/dashboard-auth/get-user-driver-details/${userId}`,
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to fetch driver details');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearCreateError: (state) => {
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createLoading = false;
        // Optionally add the new user to the users array
        if (action.payload.data) {
          state.users.unshift(action.payload.data);
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
      });
  },
});

export const { clearCreateError } = usersSlice.actions;
export default usersSlice.reducer;