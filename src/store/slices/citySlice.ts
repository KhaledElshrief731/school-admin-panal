import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';

export interface City {
  id: string;
  name: string;
  nameEn: string;
  countryId: string;
  lessPricePerKilometer: {
    max: number;
    min: number;
  };
  lessStudentFee: {
    max: number;
    min: number;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface CitiesState {
  cities: City[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  selectedCity: City | null;
  selectedCityLoading: boolean;
  selectedCityError: string | null;
  createLoading: boolean;
  createError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
}

const initialState: CitiesState = {
  cities: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPages: 0,
  selectedCity: null,
  selectedCityLoading: false,
  selectedCityError: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
};

export const fetchCities = createAsyncThunk(
  'cities/fetchCities',
  async ({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/dashboard/cities?page=${page}&pageSize=${pageSize}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to fetch cities');
    }
  }
);

export const fetchCityById = createAsyncThunk(
  'cities/fetchCityById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/dashboard/cities/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to fetch city');
    }
  }
);

export const createCity = createAsyncThunk(
  'cities/createCity',
  async (data: Omit<City, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/dashboard/cities', data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to create city');
    }
  }
);

export const updateCity = createAsyncThunk(
  'cities/updateCity',
  async ({ id, data }: { id: string; data: Partial<City> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/dashboard/cities/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to update city');
    }
  }
);

export const deleteCity = createAsyncThunk(
  'cities/deleteCity',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/dashboard/cities/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to delete city');
    }
  }
);

const citySlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.cities = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCityById.pending, (state) => {
        state.selectedCityLoading = true;
        state.selectedCityError = null;
      })
      .addCase(fetchCityById.fulfilled, (state, action: PayloadAction<City>) => {
        state.selectedCityLoading = false;
        state.selectedCity = action.payload;
      })
      .addCase(fetchCityById.rejected, (state, action) => {
        state.selectedCityLoading = false;
        state.selectedCityError = action.payload as string;
      })
      .addCase(createCity.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createCity.fulfilled, (state, action: PayloadAction<City>) => {
        state.createLoading = false;
        state.cities.unshift(action.payload);
        state.totalItems += 1;
      })
      .addCase(createCity.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
      })
      .addCase(updateCity.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateCity.fulfilled, (state, action: PayloadAction<City>) => {
        state.updateLoading = false;
        state.selectedCity = action.payload;
        // Update in cities list if present
        const idx = state.cities.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.cities[idx] = action.payload;
      })
      .addCase(updateCity.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      })
      .addCase(deleteCity.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteCity.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false;
        state.cities = state.cities.filter(city => city.id !== action.payload);
        state.totalItems = Math.max(0, state.totalItems - 1);
        if (state.selectedCity?.id === action.payload) {
          state.selectedCity = null;
        }
      })
      .addCase(deleteCity.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      });
  },
});

export default citySlice.reducer;
