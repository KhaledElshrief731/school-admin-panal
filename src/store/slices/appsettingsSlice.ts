import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface AppSetting {
  id: string;
  key: {
    ar: string;
    en: string;
    ku: string;
  };
  value: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface AppSettingsState {
  settings: AppSetting[];
  loading: boolean;
  error: string | null;
}

const initialState: AppSettingsState = {
  settings: [],
  loading: false,
  error: null,
};

export const fetchAppSettings = createAsyncThunk(
  'appsettings/fetchAppSettings',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://mahfouzapp.com/app-settings', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      return response.data.settings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch app settings');
    }
  }
);

export const updateAppSetting = createAsyncThunk(
  'appsettings/updateAppSetting',
  async ({ id, value }: { id: string; value: boolean }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://mahfouzapp.com/app-settings/${id}`,
        { value },
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        }
      );
      return { id, value: response.data.value };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update app setting');
    }
  }
);

const appsettingsSlice = createSlice({
  name: 'appsettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppSettings.fulfilled, (state, action: PayloadAction<AppSetting[]>) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchAppSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAppSetting.fulfilled, (state, action) => {
        const { id } = action.payload;
        // Use the intended value from the action meta, not the backend response
        const value = action.meta.arg.value;
        const setting = state.settings.find(s => s.id === id);
        if (setting) {
          setting.value = value;
        }
      });
  },
});

export default appsettingsSlice.reducer;