import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarExpanded: boolean;
  theme: 'dark' | 'light';
  language: 'ar' | 'en';
  notifications: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  };
}

const initialState: UiState = {
  sidebarExpanded: false,
  theme: 'dark',
  language: 'ar',
  notifications: {
    show: false,
    message: '',
    type: 'info'
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarExpanded: (state, action: PayloadAction<boolean>) => {
      state.sidebarExpanded = action.payload;
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'ar' | 'en'>) => {
      state.language = action.payload;
    },
    showNotification: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'warning' | 'info' }>) => {
      state.notifications = {
        show: true,
        message: action.payload.message,
        type: action.payload.type
      };
    },
    hideNotification: (state) => {
      state.notifications.show = false;
    }
  }
});

export const {
  setSidebarExpanded,
  setTheme,
  setLanguage,
  showNotification,
  hideNotification
} = uiSlice.actions;

export default uiSlice.reducer;