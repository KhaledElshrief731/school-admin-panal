import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCity } from '../../store/slices/citySlice';
import type { RootState, AppDispatch } from '../../store';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal';
import { showToast } from '../../store/slices/toastSlice';

interface DeleteCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: {
    id: string;
    name: string;
    nameEn: string;
  } | null;
}

const DeleteCityModal: React.FC<DeleteCityModalProps> = ({ isOpen, onClose, city }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { deleteLoading, deleteError } = useSelector((state: RootState) => state.city);

  const handleDelete = async () => {
    if (city) {
      const resultAction = await dispatch(deleteCity(city.id));
      if (deleteCity.fulfilled.match(resultAction)) {
        dispatch(showToast({ message: "تم حذف المدينة بنجاح", type: "success" }));
        onClose();
      } else {
        dispatch(showToast({ message: "حدث خطأ أثناء الحذف", type: "error" }));
      }
    }
  };

  if (!isOpen || !city) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="حذف المدينة" widthClass="max-w-md">
      {deleteError && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{deleteError}</p>
        </div>
      )}
      <div className="flex items-start gap-4 mb-6">
        <div className="p-2 bg-yellow-500/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">تأكيد الحذف</h3>
          <p className="text-gray-400">
            هل أنت متأكد من أنك تريد حذف المدينة التالية؟ هذا الإجراء لا يمكن التراجع عنه.
          </p>
        </div>
      </div>
      <div className="bg-dark-400 rounded-lg p-4 mb-6">
        <div className="space-y-2">
          <div>
            <span className="text-sm text-gray-400">الاسم (عربي):</span>
            <p className="font-medium text-white">{city.name}</p>
          </div>
          <div>
            <span className="text-sm text-gray-400">الاسم (إنجليزي):</span>
            <p className="font-medium text-white">{city.nameEn}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleDelete}
          disabled={deleteLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {deleteLoading ? 'جاري الحذف...' : 'حذف المدينة'}
        </button>
        <button
          onClick={onClose}
          disabled={deleteLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
        >
          <X className="w-4 h-4" />
          إلغاء
        </button>
      </div>
    </Modal>
  );
};

export default DeleteCityModal;
