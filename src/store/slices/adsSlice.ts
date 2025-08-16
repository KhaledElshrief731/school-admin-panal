import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { AdsState, AdsApiResponse, CreateAd, CreateAdResponse } from '../../types/ads';

const initialState: AdsState = {
  ads: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPages: 0,
  createLoading: false,
  createError: null,
};

export const fetchAds = createAsyncThunk(
  'ads/fetchAds',
  async (
    params: {
      page?: number;
      pageSize?: number;
      type?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const {
        page = 1,
        pageSize = 10,
        type = 'APP_ADS',
      } = params;

      const response = await api.get<AdsApiResponse>('/dashboard/notifications', {
        params: {
          page,
          pageSize,
          type,
        },
      });

      if (response.data.code === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message?.english || 'Failed to fetch ads');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.english || 
        error.message || 
        'Failed to fetch ads'
      );
    }
  }
);

export const createAd = createAsyncThunk(
  'ads/createAd',
  async (adData: CreateAd, { rejectWithValue }) => {
    try {
      const response = await api.post<CreateAdResponse>('/dashboard/notifications', adData);

      if (response.data.code === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message?.english || 'Failed to create ad');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.english || 
        error.message || 
        'Failed to create ad'
      );
    }
  }
);

const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearAds: (state) => {
      state.ads = [];
      state.totalItems = 0;
      state.totalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAds.fulfilled, (state, action: PayloadAction<AdsApiResponse>) => {
        state.loading = false;
        state.ads = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createAd.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createAd.fulfilled, (state, action: PayloadAction<CreateAdResponse>) => {
        state.createLoading = false;
        state.createError = null;
        // Add the new ad to the beginning of the list
        state.ads.unshift(action.payload.data);
        state.totalItems += 1;
      })
      .addCase(createAd.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
      });
  },
});

export const { clearError, clearCreateError, clearAds } = adsSlice.actions;
export default adsSlice.reducer;
