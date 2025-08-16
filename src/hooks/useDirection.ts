import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const rtlLanguages = ['ar', 'ku'];

export const useDirection = () => {
  const { i18n } = useTranslation();
  
  const isRTL = rtlLanguages.includes(i18n.language);
  const direction = isRTL ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', i18n.language);
    
    // Update body class for additional styling
    document.body.className = document.body.className.replace(/\b(rtl|ltr)\b/g, '');
    document.body.classList.add(direction);
  }, [i18n.language, direction]);

  return {
    isRTL,
    direction,
    language: i18n.language,
    getAlignmentClass: (align?: 'left' | 'center' | 'right') => {
      if (align === 'center') return 'text-center';
      if (align === 'left') return isRTL ? 'text-left' : 'text-left';
      if (align === 'right') return isRTL ? 'text-right' : 'text-right';
      return isRTL ? 'text-right' : 'text-left';
    },
    getFlexDirection: () => isRTL ? 'flex-row-reverse' : 'flex-row',
    getSpacingClass: () => isRTL ? 'space-x-reverse' : ''
  };
};