import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { removeToast } from '../../store/slices/toastSlice';

const ReduxToast: React.FC = () => {
  const toasts = useSelector((state: RootState) => state.toast.toasts);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeToast(toasts[0].id));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toasts, dispatch]);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-[320px] max-w-xs px-6 py-4 rounded-xl shadow-lg text-lg font-bold flex items-center ${
            toast.type === 'success'
              ? 'bg-green-600'
              : toast.type === 'error'
              ? 'bg-red-600'
              : toast.type === 'warning'
              ? 'bg-yellow-600 text-black'
              : 'bg-blue-600'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ReduxToast;
