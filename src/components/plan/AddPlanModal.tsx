import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import Modal from '../ui/Modal';
import { showToast } from '../../store/slices/toastSlice';

interface AddPlanModalProps {
  show: boolean;
  onClose: () => void;
  form: {
    description: string;
    amount: string;
    currency: string;
    type: string;
    duration: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<boolean>;
}

const AddPlanModal: React.FC<AddPlanModalProps> = ({ show, onClose, form, onChange, onSubmit }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    const success = await onSubmit(e);
    if (success) {
      dispatch(showToast({ message: t('plans.planCreated'), type: 'success' }));
    } else {
      dispatch(showToast({ message: t('plans.planCreateError'), type: 'error' }));
    }
  };

  return (
    <Modal isOpen={show} onClose={onClose} title={t('plans.addNewPlan')} widthClass="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">{t('plans.description')}</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={onChange}
            required
            className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-primary-200"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">{t('plans.price')}</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={onChange}
            required
            min="0"
            step="0.01"
            className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-primary-200"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">{t('plans.currency')}</label>
          <input
            type="text"
            name="currency"
            value={form.currency}
            onChange={onChange}
            required
            className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-primary-200"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">{t('plans.serviceType')}</label>
          <select
            name="type"
            value={form.type}
            onChange={onChange}
            required
            className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-primary-200"
          >
            <option value="">{t('plans.selectType')}</option>
            <option value="APP_FEATURE">{t('plans.appFeatures')}</option>
            <option value="DRIVER_GROUP">{t('plans.driverGroup')}</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">{t('plans.duration')}</label>
          <select
            name="duration"
            value={form.duration}
            onChange={onChange}
            className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-primary-200"
          >
            <option value="">{t('plans.selectDuration')}</option>
            <option value="MONTHLY">{t('plans.monthly')}</option>
            <option value="HALF_MONTHLY">{t('plans.halfMonthly')}</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-bold transition-colors"
        >
          {t('plans.addNewPlan')}
        </button>
      </form>
    </Modal>
  );
};

export default AddPlanModal;
