import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export interface Vehicle {
    id: string;
    vehicleType: string;
    maxPassengers: number;
    lessPassengers: number;
    createdAt: string;
    updatedAt: string;
}

interface VehicleState {
    vehicles: Vehicle[];
    loading: boolean;
    error: string | null;
}

const initialState: VehicleState = {
  vehicles: [],
  loading: false,
  error: null,
};

export const fetchVehicles = createAsyncThunk(
    'vehicles/fetchVehicles',
  async (_, { rejectWithValue }) => {
        try {
      const response = await api.get('/dashboard/vehicle');
      return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to fetch vehicles');
        }
    }
);

const vehicleSlice = createSlice({
    name: 'vehicles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVehicles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
            state.loading = false;
        state.vehicles = action.payload;
        })
        .addCase(fetchVehicles.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
      });
  },
});

export default vehicleSlice.reducer;

    
