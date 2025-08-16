import React from 'react';
import { CreditCard, Calendar, DollarSign, FileText } from 'lucide-react';
import { Subscription } from '../../store/slices/subscriptionSlice';
import { useTranslation } from 'react-i18next';

interface PlanCardProps {
  plan: Subscription;
  getDurationText: (duration: string) => string;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, getDurationText }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 p-2 rounded-lg">
            <CreditCard className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{t('plans.premiumPlan')}</h3>
            <p className="text-sm text-gray-500">Premium Plan</p>
          </div>
        </div>
        <span className="bg-success-100 text-success-700 text-xs px-2 py-1 rounded-full">
          {t('common.active')}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <FileText className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">{t('plans.description')}</p>
            <p className="text-sm font-medium text-gray-800">{plan.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">{t('plans.price')}</p>
            <p className="text-lg font-bold text-primary-600">
              {plan.amount} {plan.currency}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">{t('plans.duration')}</p>
            <p className="text-sm font-medium text-gray-800">
              {getDurationText(plan.duration)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">{t('plans.serviceType')}</p>
          <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
            {t(`plans.${plan.type === 'APP_FEATURE' ? 'appFeatures' : 'driverGroup'}`)}
          </span>
        </div>
      </div>

      <div className="mt-6 flex space-x-3 gap-2">
        <button className="flex-1  bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
          {t('plans.editPlan')}
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
          {t('plans.viewDetails')}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;
