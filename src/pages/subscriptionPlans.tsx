import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { fetchSubscriptions, createSubscription, clearError, clearSuccess } from '../store/slices/subscriptionSlice';
import type { RootState, AppDispatch } from '../store';
import PlanCard from '../components/plan/PlanCard';
import AddPlanModal from '../components/plan/AddPlanModal';

const SubscriptionPlans = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { subscriptions, loading, error, success } = useSelector((state: RootState) => state.subscription);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    description: '',
    amount: '',
    currency: 'USD',
    type: '',
    duration: 'MONTHLY',
  });

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dispatch(clearSuccess()), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const getDurationText = (duration: string) => {
    switch (duration) {
      case 'MONTHLY':
        return 'شهري';
      case 'HALF_MONTHLY':
        return 'نصف شهري';
      default:
        return duration;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleAddPlan = async (e: React.FormEvent): Promise<boolean> => {
  e.preventDefault();

  try {
    await dispatch(createSubscription({
      description: form.description,
      amount: parseFloat(form.amount),
      currency: form.currency,
      type: form.type,
      duration: form.duration,
    })).unwrap(); // unwrap throws error if rejected

    setShowModal(false);
    setForm({ description: '', amount: '', currency: 'USD', type: '', duration: 'MONTHLY' });

    return true;
  } catch (error) {
    console.error('Failed to create plan:', error);
    return false;
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{t('pages.subscriptionPlans')}</h1>
          <p className="text-gray-400">{t('pages.subscriptionPlansSubtitle')}</p>
        </div>
        <button
          className="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('plans.addNewPlan')} 
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {/* Success popup removed */}

      <AddPlanModal
        show={showModal}
        onClose={() => setShowModal(false)}
        form={form}
        onChange={handleInputChange}
        onSubmit={handleAddPlan}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <span className="inline-block"><Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" /></span>
            <p className="text-gray-400">لا توجد خطط اشتراك متاحة</p>
          </div>
        ) : (
          subscriptions.map((plan) => (
            <PlanCard key={plan.id} plan={plan} getDurationText={getDurationText} />
          ))
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlans;