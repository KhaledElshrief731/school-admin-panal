import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



export const fetchDrivers = createAsyncThunk(
  'drivers/fetchDrivers',
  async (params: { 
    isVerified?: string; 
    isPause?: string; 
    userName?: string; 
    page?: number; 
    pageSize?: number; 
  } = {}) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found in localStorage');
    const response = await axios.get('https://mahfouzapp.com/drivers', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data.data;
  }
);

export const fetchDriverById = createAsyncThunk(
  'drivers/fetchDriverById',
  async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found in localStorage');
    const response = await axios.get(`https://mahfouzapp.com/drivers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

export const fetchDriverRatings = createAsyncThunk(
  'drivers/fetchDriverRatings',
  async ({
    driverId,
    page = 1,
    pageSize = 10,
    comment,
    rate,
  }: {
    driverId: string;
    page?: number;
    pageSize?: number;
    comment?: string;
    rate?: string | number;
  }) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found in localStorage');
    const response = await axios.get(
      `https://mahfouzapp.com/drivers/rates/all`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { driverId, page, pageSize, comment, rate },
      }
    );
    return response.data;
  }
);

export interface DriverVehicle {
  id: string;
  driverId: string;
  modelYear: number;
  carModel: string;
  vehicleId: string;
  color: string;
  keyNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverUser {
  userName: string;
  image: string;
  city: { name: string; nameEn: string };
  country: { name: string; nameEn: string };
  region: string;
  gender: string;
  isVerified: boolean;
  dateOfBirth: string | null;
  phone: string;
}

export interface Driver {
  id: string;
  homePicture: string[];
  drivingLicense: string[];
  personalCard: string[];
  isVerified: boolean;
  isPause: boolean;
  avgRate: number;
  vehicleId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  DriverVehicle: DriverVehicle[];
  user: DriverUser;
}

//try and catch
const driversSlice = createSlice({
  name: 'drivers',
  initialState: {
    data: [],
    loading: false,
    error: null as string | null,
    selectedDriver: null as Driver | null,
    selectedDriverLoading: false,
    selectedDriverError: null as string | null,
    ratingsData: [],
    ratingsLoading: false,
    ratingsError: null as string | null,
    ratingsTotalItems: 0,
    ratingsTotalPages: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch drivers';
      })
      .addCase(fetchDriverById.pending, (state) => {
        state.selectedDriverLoading = true;
        state.selectedDriverError = null;
        state.selectedDriver = null;
      })
      .addCase(fetchDriverById.fulfilled, (state, action) => {
        state.selectedDriverLoading = false;
        state.selectedDriver = action.payload;
      })
      .addCase(fetchDriverById.rejected, (state, action) => {
        state.selectedDriverLoading = false;
        state.selectedDriverError = action.error.message || 'Failed to fetch driver';
      })
      .addCase(fetchDriverRatings.pending, (state) => {
        state.ratingsLoading = true;
        state.ratingsError = null;
      })
      .addCase(fetchDriverRatings.fulfilled, (state, action) => {
        state.ratingsLoading = false;
        state.ratingsData = action.payload.data;
        state.ratingsTotalItems = action.payload.totalItems;
        state.ratingsTotalPages = action.payload.totalPages;
      })
      .addCase(fetchDriverRatings.rejected, (state, action) => {
        state.ratingsLoading = false;
        state.ratingsError = action.error.message || 'Failed to fetch driver ratings';
      });
  },
});

export default driversSlice.reducer;
