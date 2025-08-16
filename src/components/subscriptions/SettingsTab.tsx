import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';

interface PaymentSetting {
  id: string;
  label: string;
  enabled: boolean;
}

const SettingsTab: React.FC = () => {
  const [generalSettings, setGeneralSettings] = useState<PaymentSetting[]>([
    { id: 'default_currency', label: 'العملة الافتراضية', enabled: true },
    { id: 'trial_period', label: 'عدد أيام الفترة التجريبية', enabled: true },
    { id: 'send_reminders', label: 'إرسال تذكيرات', enabled: true },
    { id: 'auto_renewal', label: 'التجديد التلقائي', enabled: true }
  ]);
  const [commissionSettings, setCommissionSettings] = useState<PaymentSetting[]>([
    { id: 'commission_rate', label: 'معدل صرف العمولات', enabled: true },
    { id: 'agent_commission', label: 'نسبة عمولة الوكيل', enabled: true }
  ]);

  const handleToggleGeneralSetting = (id: string) => {
    setGeneralSettings(prev =>
      prev.map(setting =>
        setting.id === id
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const handleToggleCommissionSetting = (id: string) => {
    setCommissionSettings(prev =>
      prev.map(setting =>
        setting.id === id
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* General Settings */}
      <div className="bg-dark-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">الإعدادات العامة</h3>
          <span className="text-sm text-gray-400">عدد أيام الفترة التجريبية</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              العملة الافتراضية
            </label>
            <select className="w-full bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600">
              <option value="IQD">IQD (د.ع)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              عدد أيام الفترة التجريبية
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value="14"
                className="flex-1 bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600"
                readOnly
              />
              <button className="p-2 bg-dark-400 border border-dark-200 rounded-lg text-gray-400 hover:text-white">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {generalSettings.map((setting, index) => (
            <div key={setting.id} className="flex items-center justify-between py-3 border-b border-dark-300 last:border-b-0">
              <div>
                <span className="text-white font-medium">{setting.label}</span>
                <div className="text-sm text-gray-400">
                  {setting.id === 'default_currency' && 'العملة المستخدمة في جميع المعاملات المالية'}
                  {setting.id === 'trial_period' && 'عدد الأيام التي يحصل عليها المستخدم في التجربة المجانية'}
                  {setting.id === 'send_reminders' && 'إرسال إشعارات المستخدم من قبل انتهاء اشتراكهم'}
                  {setting.id === 'auto_renewal' && 'تجديد الاشتراكات تلقائياً عند انتهاء المدة'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={setting.enabled}
                  onChange={() => handleToggleGeneralSetting(setting.id)}
                  className="sr-only peer"
                />
                <div className={`relative w-11 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-primary-600' : 'bg-gray-600'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${setting.enabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0.5 rtl:-translate-x-0.5'}`}></div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
      {/* Commission Settings */}
      <div className="bg-dark-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">إعدادات العمولات</h3>
          <span className="text-sm text-gray-400">نسبة عمولة الوكيل</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              معدل صرف العمولات
            </label>
            <select className="w-full bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600">
              <option value="monthly">شهري</option>
              <option value="weekly">أسبوعي</option>
              <option value="daily">يومي</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              نسبة عمولة الوكيل
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value="7"
                className="flex-1 bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600"
                readOnly
              />
              <span className="text-gray-400">%</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {commissionSettings.map((setting, index) => (
            <div key={setting.id} className="flex items-center justify-between py-3 border-b border-dark-300 last:border-b-0">
              <div>
                <span className="text-white font-medium">{setting.label}</span>
                <div className="text-sm text-gray-400">
                  {setting.id === 'commission_rate' && 'تحديد توقيت صرف العمولات للوكلاء'}
                  {setting.id === 'agent_commission' && 'نسبة العمولة التي يحصل عليها الوكيل من كل اشتراك'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={setting.enabled}
                  onChange={() => handleToggleCommissionSetting(setting.id)}
                  className="sr-only peer"
                />
                <div className={`relative w-11 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-primary-600' : 'bg-gray-600'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${setting.enabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0.5 rtl:-translate-x-0.5'}`}></div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-between">
        <button className="bg-dark-200 hover:bg-dark-100 text-white px-6 py-3 rounded-lg transition-colors">
          إلغاء
        </button>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
          <Save className="w-5 h-5" />
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
};

export default SettingsTab; 