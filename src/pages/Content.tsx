import React from 'react';
import { Save, Upload, Eye, Edit, Trash2, Plus, Image, FileText, Settings, Globe, Monitor, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  setActiveTab,
  setSelectedDevice,
  addSection,
  updateSection,
  deleteSection,
  toggleSection,
  updateSectionContent
} from '../store/slices/contentSlice';

const Content: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { sections, activeTab, selectedDevice } = useAppSelector(state => state.content);

  const tabs = [
    'عن التطبيق',
    'المميزات',
    'الجدول المرئي',
    'إدارة محتوى الصفحة الرئيسية'
  ];

  const handleSaveContent = () => {
    console.log('Saving content sections:', sections);
    // Handle save logic here
  };

  const handleToggleSection = (id: string) => {
    dispatch(toggleSection(id));
  };

  const handleUpdateContent = (id: string, newContent: string) => {
    dispatch(updateSectionContent({ id, content: newContent }));
  };

  const handleAddSection = () => {
    dispatch(addSection({
      title: 'قسم جديد',
      type: 'text',
      content: 'محتوى جديد',
      isActive: true
    }));
  };

  const handleDeleteSection = (id: string) => {
    dispatch(deleteSection(id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'banner':
        return <Monitor className="w-4 h-4" />;
      case 'form':
        return <Settings className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text':
        return 'text-blue-400';
      case 'image':
        return 'text-green-400';
      case 'banner':
        return 'text-purple-400';
      case 'form':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  const renderMainContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">إدارة محتوى الصفحة الرئيسية</h2>
          <p className="text-gray-400 mt-1">تعديل وإدارة محتوى الصفحة الرئيسية للموقع</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddSection}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            إضافة قسم جديد
          </button>
          <button
            onClick={handleSaveContent}
            className="bg-success-600 hover:bg-success-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            حفظ التغييرات
          </button>
        </div>
      </div>

      {/* Device Preview Selector */}
      <div className="bg-dark-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">معاينة المحتوى</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(setSelectedDevice('desktop'))}
              className={`p-2 rounded-lg transition-colors ${
                selectedDevice === 'desktop'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-300 text-gray-400 hover:text-white'
              }`}
            >
              <Monitor className="w-5 h-5" />
            </button>
            <button
              onClick={() => dispatch(setSelectedDevice('mobile'))}
              className={`p-2 rounded-lg transition-colors ${
                selectedDevice === 'mobile'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-300 text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className={`bg-dark-400 rounded-lg p-6 ${
          selectedDevice === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
        }`}>
          <div className="text-center">
            <Globe className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <p className="text-gray-400">معاينة المحتوى - {selectedDevice === 'desktop' ? 'سطح المكتب' : 'الهاتف المحمول'}</p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-dark-200 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-dark-300 ${getTypeColor(section.type)}`}>
                  {getTypeIcon(section.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{section.title}</h3>
                  <span className="text-sm text-gray-400 capitalize">{section.type}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={section.isActive}
                    onChange={() => handleToggleSection(section.id)}
                    className="sr-only peer"
                  />
                  <div className={`relative w-11 h-6 rounded-full transition-colors ${
                    section.isActive ? 'bg-primary-600' : 'bg-gray-600'
                  }`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      section.isActive ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0.5 rtl:-translate-x-0.5'
                    }`}></div>
                  </div>
                </label>
                
                <button className="p-2 text-blue-400 hover:text-blue-300 hover:bg-dark-300 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-green-400 hover:text-green-300 hover:bg-dark-300 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSection(section.id)}
                  className="p-2 text-error-400 hover:text-error-300 hover:bg-dark-300 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {section.type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    محتوى النص
                  </label>
                  <textarea
                    value={section.content}
                    onChange={(e) => handleUpdateContent(section.id, e.target.value)}
                    className="w-full bg-dark-400 border border-dark-300 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="أدخل محتوى النص..."
                  />
                </div>
              )}

              {(section.type === 'image' || section.type === 'banner') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    رابط {section.type === 'image' ? 'الصورة' : 'البانر'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={section.content}
                      onChange={(e) => handleUpdateContent(section.id, e.target.value)}
                      className="flex-1 bg-dark-400 border border-dark-300 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                      placeholder="أدخل رابط الصورة..."
                    />
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                      <Upload className="w-4 h-4" />
                      رفع
                    </button>
                  </div>
                </div>
              )}

              {section.type === 'form' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    إعدادات النموذج
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="عنوان النموذج"
                      className="bg-dark-400 border border-dark-300 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                    <select className="bg-dark-400 border border-dark-300 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600">
                      <option>نوع النموذج</option>
                      <option>تسجيل</option>
                      <option>تواصل</option>
                      <option>اشتراك</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {!section.isActive && (
              <div className="mt-4 p-3 bg-warning-600/20 border border-warning-600/30 rounded-lg">
                <p className="text-warning-400 text-sm">هذا القسم غير مفعل ولن يظهر في الموقع</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {sections.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">لا توجد أقسام محتوى</h3>
          <p className="text-gray-500 mb-4">ابدأ بإضافة قسم محتوى جديد للصفحة الرئيسية</p>
          <button
            onClick={handleAddSection}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة قسم جديد
          </button>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-dark-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">رفع الملفات والصور</h3>
        <div className="border-2 border-dashed border-dark-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">اسحب وأفلت الملفات هنا أو انقر للاختيار</p>
          <p className="text-sm text-gray-500 mb-4">أو يمكنك إضافة رابط الملفات هنا</p>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="أدخل رابط الملف..."
              className="w-full bg-dark-400 border border-dark-300 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 mb-3"
            />
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors">
              إضافة الرابط
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">اختر صورة للصفحة الرئيسية</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <input
              type="checkbox"
              id="homepage-image"
              className="w-4 h-4 text-primary-600 bg-dark-400 border-dark-200 rounded focus:ring-primary-500"
            />
            <label htmlFor="homepage-image" className="text-sm text-gray-300">
              صورة الخلفية الرئيسية
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('pages.contentManagement')}</h1>
          <p className="text-gray-400 mt-1">{t('pages.contentSubtitle')}</p>
        </div>
      </div>

      <div className="bg-dark-300 rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-dark-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => dispatch(setActiveTab(tab))}
                className={`
                  px-6 py-4 whitespace-nowrap font-medium transition-colors border-b-2
                  ${activeTab === tab
                    ? 'bg-dark-200 text-white border-primary-600'
                    : 'text-gray-400 hover:text-white hover:bg-dark-200/50 border-transparent'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'إدارة محتوى الصفحة الرئيسية' && renderMainContent()}
          {activeTab !== 'إدارة محتوى الصفحة الرئيسية' && (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">قسم {activeTab}</h3>
              <p className="text-gray-500">هذا القسم قيد التطوير</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Content;