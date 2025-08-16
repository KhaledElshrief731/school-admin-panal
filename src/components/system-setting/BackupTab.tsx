import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingToggle {
  id: string;
  label: string;
  enabled: boolean;
}

const BackupTab: React.FC = () => {
  const [backupSettings, setBackupSettings] = useState<SettingToggle[]>([
    { id: 'auto_backup', label: 'النسخ الاحتياطي التلقائي', enabled: true },
    { id: 'manual_restore', label: 'الاستعادة اليدوية', enabled: true }
  ]);
  const [backupFrequency, setBackupFrequency] = useState('يومي');

  const handleBackupToggle = (id: string) => {
    setBackupSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const handleSaveSettings = () => {
    console.log('Saving backup settings:', backupSettings);
    console.log('Backup frequency:', backupFrequency);
    // Handle save logic here
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {backupSettings.map((setting, index) => (
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
                {setting.label}
              </label>
            </div>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id={setting.id}
                  checked={setting.enabled}
                  onChange={() => handleBackupToggle(setting.id)}
                  className="sr-only peer"
                />
                <div className={`
                  relative w-14 h-7 rounded-full transition-colors duration-200 ease-in-out
                  ${setting.enabled 
                    ? 'bg-primary-600' 
                    : 'bg-gray-600'
                  }
                  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300/20
                `}>
                  <div className={`
                    absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out
                    ${setting.enabled 
                      ? 'translate-x-7 rtl:-translate-x-7' 
                      : 'translate-x-0.5 rtl:-translate-x-0.5'
                    }
                  `}></div>
                </div>
              </label>
            </div>
          </motion.div>
        ))}
        {/* Backup Frequency Dropdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="py-4"
        >
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-white">
              تردد النسخ الاحتياطي
            </label>
            <div className="flex items-center">
              <select
                value={backupFrequency}
                onChange={(e) => setBackupFrequency(e.target.value)}
                className="bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent min-w-[120px]"
              >
                <option value="يومي">يومي</option>
                <option value="أسبوعي">أسبوعي</option>
                <option value="شهري">شهري</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Save Button */}
      <div className="pt-6 border-t border-dark-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveSettings}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Save className="w-5 h-5" />
          حفظ التعديلات
        </motion.button>
      </div>
    </div>
  );
};

export default BackupTab; 