import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';

export interface School {
  id: string;
  name: string;
  nameEn: string;
  address: string;
  latitude: number;
  longitude: number;
  cityId: string;
  countryId: string;
  placeId?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface SchoolsState {
  schools: School[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  selectedSchool: School | null;
  selectedSchoolLoading: boolean;
  selectedSchoolError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  createLoading: boolean;
  createError: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
}

const initialState: SchoolsState = {
  schools: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPages: 0,
  selectedSchool: null,
  selectedSchoolLoading: false,
  selectedSchoolError: null,
  updateLoading: false,
  updateError: null,
  createLoading: false,
  createError: null,
  deleteLoading: false,
  deleteError: null,
};

export const fetchSchools = createAsyncThunk(
  'schools/fetchSchools',
  async (
    {
      page = 1,
      pageSize = 10,
      name,
      cityId,
      countryId,
    }: { page?: number; pageSize?: number; name?: string; cityId?: string; countryId?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      const params: any = { page, pageSize };
      if (name) params.name = name;
      if (cityId) params.cityId = cityId;
      if (countryId) params.countryId = countryId;
      const response = await api.get('/dashboard/schools', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to fetch schools');
    }
  }
);

export const fetchSchoolById = createAsyncThunk(
  'schools/fetchSchoolById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/dashboard/schools/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to fetch school');
    }
  }
);

export const updateSchool = createAsyncThunk(
  'schools/updateSchool',
  async ({ id, data }: { id: string; data: Partial<School> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/dashboard/schools/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to update school');
    }
  }
);

export const createSchool = createAsyncThunk(
  'schools/createSchool',
  async (data: Omit<School, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/dashboard/schools', data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to create school');
    }
  }
);

export const deleteSchool = createAsyncThunk(
  'schools/deleteSchool',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/dashboard/schools/${id}`);
      return { id, response: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message?.english || error.message || 'Failed to delete school');
    }
  }
);

const schoolSlice = createSlice({
  name: 'schools',
  initialState,
  reducers: {
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchools.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.schools = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSchoolById.pending, (state) => {
        state.selectedSchoolLoading = true;
        state.selectedSchoolError = null;
      })
      .addCase(fetchSchoolById.fulfilled, (state, action: PayloadAction<School>) => {
        state.selectedSchoolLoading = false;
        state.selectedSchool = action.payload;
      })
      .addCase(fetchSchoolById.rejected, (state, action) => {
        state.selectedSchoolLoading = false;
        state.selectedSchoolError = action.payload as string;
      })
      .addCase(updateSchool.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateSchool.fulfilled, (state, action: PayloadAction<School>) => {
        state.updateLoading = false;
        state.selectedSchool = action.payload;
        // Update the school in the schools list if it exists
        const index = state.schools.findIndex(school => school.id === action.payload.id);
        if (index !== -1) {
          state.schools[index] = action.payload;
        }
      })
      .addCase(updateSchool.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      })
      .addCase(createSchool.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createSchool.fulfilled, (state, action: PayloadAction<School>) => {
        state.createLoading = false;
        // Add the new school to the beginning of the list
        state.schools.unshift(action.payload);
        state.totalItems += 1;
      })
      .addCase(createSchool.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
      })
      .addCase(deleteSchool.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteSchool.fulfilled, (state, action: PayloadAction<{ id: string; response: any }>) => {
        state.deleteLoading = false;
        // Remove the school from the list
        state.schools = state.schools.filter(school => school.id !== action.payload.id);
        state.totalItems = Math.max(0, state.totalItems - 1);
      })
      .addCase(deleteSchool.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearUpdateError, clearCreateError, clearDeleteError } = schoolSlice.actions;
export default schoolSlice.reducer;
