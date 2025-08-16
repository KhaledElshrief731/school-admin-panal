import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Interfaces
export interface ContactUsUser {
  userName: string;
  image: string;
  region: string;
  role: string;
}

export interface ContactUsItem {
  id: string;
  name: string;
  contactNumber: string;
  reason: string;
  message: string;
  files: string[];
  isRead: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  User: ContactUsUser;
    deleteError?: string;
}

export interface ContactUsResponse {
  code: number;
  data: ContactUsItem[];
  totalItems: number;
  totalPages: number;
  message: {
    arabic: string;
    english: string;
  };
}

export interface ContactUsState {
  contacts: ContactUsItem[];
  loading: boolean;
  deleteLoading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  message: {
    arabic: string;
    english: string;
  } | null;
    deleteError?: string;
}

const initialState: ContactUsState = {
  contacts: [],
  loading: false,
  deleteLoading: false,
  error: null,
  totalItems: 0,
  totalPages: 0,
  message: null,
};

// Async thunk
export const fetchContactUs = createAsyncThunk(
  'contactUs/fetchContactUs',
  async ({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<ContactUsResponse>(`/dashboard/contact-us?page=${page}&pageSize=${pageSize}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contact us data');
    }
  }
);

export const deleteContactUs = createAsyncThunk(
  'contactUs/deleteContactUs',
  async (contactId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/dashboard/contact-us/${contactId}`);
      return { contactId, response: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete contact us item');
    }
  }
);

// Slice
const contactUsSlice = createSlice({
  name: 'contactUs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactUs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.message = action.payload.message;
      })
      .addCase(fetchContactUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteContactUs.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteContactUs.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.contacts = state.contacts.filter(contact => contact.id !== action.payload.contactId);
        state.totalItems = Math.max(0, state.totalItems - 1);
      })
      .addCase(deleteContactUs.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = contactUsSlice.actions;
export default contactUsSlice.reducer; 