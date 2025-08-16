import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContentSection {
  id: string;
  title: string;
  type: 'text' | 'image' | 'banner' | 'form';
  content: string;
  isActive: boolean;
  order: number;
}

interface ContentState {
  sections: ContentSection[];
  activeTab: string;
  selectedDevice: 'desktop' | 'mobile';
  isLoading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  sections: [
    {
      id: '1',
      title: 'إعدادات العنوان الرئيسي',
      type: 'text',
      content: 'منصة تعليمية متقدمة تربط المدارس بأولياء الأمور',
      isActive: true,
      order: 1
    },
    {
      id: '2',
      title: 'وزارة محتوى الصفحة الرئيسية',
      type: 'text',
      content: 'تعديل وإدارة محتوى الصفحة الرئيسية للموقع',
      isActive: true,
      order: 2
    },
    {
      id: '3',
      title: 'نظام إدارة المدارس المتكامل',
      type: 'text',
      content: 'منصة تعليمية متقدمة تربط المدارس بأولياء الأمور',
      isActive: true,
      order: 3
    },
    {
      id: '4',
      title: 'نص آخر',
      type: 'text',
      content: 'ابدأ الآن',
      isActive: true,
      order: 4
    },
    {
      id: '5',
      title: 'رابط آخر',
      type: 'text',
      content: '/register',
      isActive: true,
      order: 5
    },
    {
      id: '6',
      title: 'صورة الخلفية',
      type: 'image',
      content: '/images/background.jpg',
      isActive: true,
      order: 6
    }
  ],
  activeTab: 'إدارة محتوى الصفحة الرئيسية',
  selectedDevice: 'desktop',
  isLoading: false,
  error: null
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setSelectedDevice: (state, action: PayloadAction<'desktop' | 'mobile'>) => {
      state.selectedDevice = action.payload;
    },
    addSection: (state, action: PayloadAction<Omit<ContentSection, 'id' | 'order'>>) => {
      const newSection: ContentSection = {
        ...action.payload,
        id: Date.now().toString(),
        order: state.sections.length + 1
      };
      state.sections.push(newSection);
    },
    updateSection: (state, action: PayloadAction<{ id: string; updates: Partial<ContentSection> }>) => {
      const { id, updates } = action.payload;
      const sectionIndex = state.sections.findIndex(section => section.id === id);
      if (sectionIndex !== -1) {
        state.sections[sectionIndex] = { ...state.sections[sectionIndex], ...updates };
      }
    },
    deleteSection: (state, action: PayloadAction<string>) => {
      state.sections = state.sections.filter(section => section.id !== action.payload);
    },
    toggleSection: (state, action: PayloadAction<string>) => {
      const section = state.sections.find(section => section.id === action.payload);
      if (section) {
        section.isActive = !section.isActive;
      }
    },
    updateSectionContent: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const { id, content } = action.payload;
      const section = state.sections.find(section => section.id === id);
      if (section) {
        section.content = content;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  setActiveTab,
  setSelectedDevice,
  addSection,
  updateSection,
  deleteSection,
  toggleSection,
  updateSectionContent,
  setLoading,
  setError
} = contentSlice.actions;

export default contentSlice.reducer;