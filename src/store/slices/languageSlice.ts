import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SupportedLanguage = 'ar' | 'en' | 'ku';

interface LanguageState {
  currentLanguage: SupportedLanguage;
  isRTL: boolean;
  availableLanguages: Array<{
    code: SupportedLanguage;
    name: string;
    nativeName: string;
    flag: string;
    dir: 'rtl' | 'ltr';
  }>;
}

const initialState: LanguageState = {
  currentLanguage: 'ar',
  isRTL: true,
  availableLanguages: [
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
    { code: 'ku', name: 'Kurdish', nativeName: 'کوردی', flag: '🟡🔴🟢', dir: 'rtl' }
  ]
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<SupportedLanguage>) => {
      state.currentLanguage = action.payload;
      const language = state.availableLanguages.find(lang => lang.code === action.payload);
      state.isRTL = language?.dir === 'rtl' || false;
    },
    toggleDirection: (state) => {
      state.isRTL = !state.isRTL;
    }
  }
});

export const { setLanguage, toggleDirection } = languageSlice.actions;
export default languageSlice.reducer;