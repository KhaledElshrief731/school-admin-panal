import { useAppDispatch, useAppSelector } from './redux';
import { 
  fetchAds,
  createAd,
  fetchAdById,
  resendAd,
  removeAd,
  clearError,
  clearCreateError,
  clearSelectedAd,
  clearResendState,
  clearRemoveState
} from '../store/slices/adsSlice';
import type { CreateAd } from '../types/ads';

export const useAds = () => {
  const dispatch = useAppDispatch();
  const {
    ads,
    loading,
    error,
    totalItems,
    totalPages,
    createLoading,
    createError,
    selectedAd,
    selectedAdLoading,
    selectedAdError,
    resendLoading,
    resendError,
    resendSuccess,
    removeLoading,
    removeError,
    removeSuccess
  } = useAppSelector(state => state.ads);

  const fetchAdsList = (params?: { page?: number; pageSize?: number; type?: string }) => {
    return dispatch(fetchAds(params));
  };

  const createNewAd = (adData: CreateAd) => {
    return dispatch(createAd(adData));
  };

  const getAdById = (id: string) => {
    return dispatch(fetchAdById(id));
  };

  const resendAdById = (id: string) => {
    return dispatch(resendAd(id));
  };

  const removeAdById = (id: string) => {
    return dispatch(removeAd(id));
  };

  const clearErrors = () => {
    dispatch(clearError());
    dispatch(clearCreateError());
  };

  const clearSelectedAdData = () => {
    dispatch(clearSelectedAd());
  };

  const clearResendData = () => {
    dispatch(clearResendState());
  };

  const clearRemoveData = () => {
    dispatch(clearRemoveState());
  };

  return {
    ads,
    loading,
    error,
    totalItems,
    totalPages,
    createLoading,
    createError,
    selectedAd,
    selectedAdLoading,
    selectedAdError,
    resendLoading,
    resendError,
    resendSuccess,
    removeLoading,
    removeError,
    removeSuccess,
    fetchAdsList,
    createNewAd,
    getAdById,
    resendAdById,
    removeAdById,
    clearErrors,
    clearSelectedAdData,
    clearResendData,
    clearRemoveData,
  };
};