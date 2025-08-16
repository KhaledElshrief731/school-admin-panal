import React, { useEffect } from 'react';
import { Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchAppSettings } from '../../store/slices/appsettingsSlice';
import { updateAppSetting } from '../../store/slices/appsettingsSlice';

const GENERAL_KEYS = [
  'البحث عن الرحلات',
  'إنشاء المجموعات غير المكتملة',
  'الإشعارات',
  'الإعلانات',
  'تنبيهات التأخير',
  'طلبات الغياب',
];

const GeneralTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { settings, loading, error } = useAppSelector(state => state.appsettings);

  useEffect(() => {
    dispatch(fetchAppSettings());
  }, [dispatch]);

  const generalSettings = settings.filter(s => GENERAL_KEYS.includes(s.key.ar));

  const handleGeneralToggle = (id: string, currentValue: boolean) => {
    dispatch(updateAppSetting({ id, value: !currentValue }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-32">جاري التحميل...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-32 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {generalSettings.map((setting, index) => (
          <motion.div
            key={setting.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between py-4 border-b border-dark-200 last:border-b-0"
          >
            <div className="flex-1">
              <label 
                htmlFor={setting.id}
                className="text-lg font-medium text-white cursor-pointer"
              >
                {setting.key.ar}
              </label>
            </div>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id={setting.id}
                  checked={!!setting.value}
                  onChange={() => handleGeneralToggle(setting.id, setting.value)}
                  className="sr-only peer"
                />
                <div className={`
                  relative w-14 h-7 rounded-full transition-colors duration-200 ease-in-out
                  ${setting.value 
                    ? 'bg-primary-600' 
                    : 'bg-gray-600'
                  }
                  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300/20
                `}>
                  <div className={`
                    absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out
                    ${setting.value 
                      ? 'translate-x-7 rtl:-translate-x-7' 
                      : 'translate-x-0.5 rtl:-translate-x-0.5'
                    }
                  `}></div>
                </div>
              </label>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GeneralTab; 