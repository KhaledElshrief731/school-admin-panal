import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { AdsState, AdsApiResponse, CreateAd, CreateAdResponse } from '../../types/ads';

export interface AdByIdResponse {
  code: number;
  message: {
    arabic: string;
    english: string;
  };
  data: any; // Ad data
}

export interface ResendAdResponse {
  code: number;
  message: {
    arabic: string;
    english: string;
  };
  data: any;
}

export interface RemoveAdResponse {
  code: number;
  message: {
    arabic: string;
    english: string;
  };
}

const initialState: AdsState = {
  ads: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPages: 0,
  createLoading: false,
  createError: null,
  selectedAd: null,
  selectedAdLoading: false,
  selectedAdError: null,
  resendLoading: false,
  resendError: null,
  resendSuccess: false,
  removeLoading: false,
  removeError: null,
  removeSuccess: false,
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

// Async thunk to fetch ad by ID
export const fetchAdById = createAsyncThunk(
  'ads/fetchAdById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<AdByIdResponse>(
        `/dashboard/notifications/ads/${id}`
      );

      if (response.data.code === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message?.english || 'Failed to fetch ad');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message?.english || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch ad';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to resend ad
export const resendAd = createAsyncThunk(
  'ads/resendAd',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.post<ResendAdResponse>(
        `/dashboard/notifications/resend/${id}`
      );

      if (response.data.code === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message?.english || 'Failed to resend ad');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message?.english || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to resend ad';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to remove ad
export const removeAd = createAsyncThunk(
  'ads/removeAd',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<RemoveAdResponse>(
        `/dashboard/notifications/remove/${id}`
      );

      if (response.data.code === 200) {
        return { id, response: response.data };
      } else {
        throw new Error(response.data.message?.english || 'Failed to remove ad');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message?.english || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to remove ad';
      return rejectWithValue(errorMessage);
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
    clearSelectedAd: (state) => {
      state.selectedAd = null;
      state.selectedAdError = null;
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
      })
      // Fetch ad by ID
      .addCase(fetchAdById.pending, (state) => {
        state.selectedAdLoading = true;
        state.selectedAdError = null;
      })
      .addCase(fetchAdById.fulfilled, (state, action: PayloadAction<AdByIdResponse>) => {
        state.selectedAdLoading = false;
        state.selectedAd = action.payload.data;
      })
      .addCase(fetchAdById.rejected, (state, action) => {
        state.selectedAdLoading = false;
        state.selectedAdError = action.payload as string;
      })
      // Resend ad
      .addCase(resendAd.pending, (state) => {
        state.resendLoading = true;
        state.resendError = null;
        state.resendSuccess = false;
      })
      .addCase(resendAd.fulfilled, (state, action) => {
        state.resendLoading = false;
        state.resendSuccess = true;
      })
      .addCase(resendAd.rejected, (state, action) => {
        state.resendLoading = false;
        state.resendError = action.payload as string;
        state.resendSuccess = false;
      })
      // Remove ad
      .addCase(removeAd.pending, (state) => {
        state.removeLoading = true;
        state.removeError = null;
        state.removeSuccess = false;
      })
      .addCase(removeAd.fulfilled, (state, action) => {
        state.removeLoading = false;
        state.removeSuccess = true;
        // Remove from ads list
        state.ads = state.ads.filter(ad => ad.id !== action.payload.id);
        state.totalItems = Math.max(0, state.totalItems - 1);
      })
      .addCase(removeAd.rejected, (state, action) => {
        state.removeLoading = false;
        state.removeError = action.payload as string;
        state.removeSuccess = false;
      });
  },
});

export const { 
  clearError, 
  clearCreateError, 
  clearAds, 
  clearSelectedAd, 
  clearResendState, 
  clearRemoveState 
} = adsSlice.actions;
export default adsSlice.reducer;
