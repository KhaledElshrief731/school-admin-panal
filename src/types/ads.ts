export interface Ad {
  id: string;
  title: {
    ar: string;
    en: string;
    ku: string;
  };
  description: {
    ar: string;
    en: string;
    ku: string;
  };
  type: string;
  userId: string | null;
  image: string | null;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAd {
  title: {
    ar: string;
    en: string;
    ku: string;
  };
  description: {
    ar: string;
    en: string;
    ku: string;
  };
  type: string;
  image?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateAdResponse {
  code: number;
  data: Ad;
  message: {
    arabic: string;
    english: string;
  };
}

export interface AdsApiResponse {
  code: number;
  data: Ad[];
  totalItems: number;
  totalPages: number;
  message: {
    arabic: string;
    english: string;
  };
}

export interface AdsState {
  ads: Ad[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  createLoading: boolean;
  createError: string | null;
}
