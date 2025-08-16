import { TFunction } from 'react-i18next';

/**
 * Get localized status text
 */
export const getLocalizedStatus = (status: string, t: TFunction): string => {
  const statusMap: Record<string, string> = {
    'active': t('common.active'),
    'suspended': t('common.suspended'),
    'banned': t('common.banned'),
    'pending': t('common.pending'),
    'complete': t('common.complete'),
    'incomplete': t('common.incomplete'),
    'verified': t('common.verified'),
    'not_activated': t('common.notVerified'),
    'male': t('common.male'),
    'female': t('common.female'),
    'student': t('common.student'),
    'parent': t('common.parent'),
    'driver': t('common.driver'),
    'paid': t('common.paid'),
    'expired': t('common.expired'),
    'inactive': t('common.inactive')
  };
  
  return statusMap[status.toLowerCase()] || status;
};

/**
 * Get localized date format based on language
 */
export const getLocalizedDateFormat = (language: string): string => {
  switch (language) {
    case 'ar':
      return 'ar-EG';
    case 'ku':
      return 'ku-IQ';
    case 'en':
    default:
      return 'en-US';
  }
};

/**
 * Format date according to current language
 */
export const formatLocalizedDate = (date: string | Date, language: string): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = getLocalizedDateFormat(language);
  
  return dateObj.toLocaleDateString(locale);
};

/**
 * Get RTL/LTR class names based on language direction
 */
export const getDirectionClasses = (isRTL: boolean) => {
  return {
    textAlign: isRTL ? 'text-right' : 'text-left',
    marginStart: isRTL ? 'mr-auto' : 'ml-auto',
    marginEnd: isRTL ? 'ml-auto' : 'mr-auto',
    paddingStart: isRTL ? 'pr-4' : 'pl-4',
    paddingEnd: isRTL ? 'pl-4' : 'pr-4',
    borderStart: isRTL ? 'border-r' : 'border-l',
    borderEnd: isRTL ? 'border-l' : 'border-r',
    roundedStart: isRTL ? 'rounded-r' : 'rounded-l',
    roundedEnd: isRTL ? 'rounded-l' : 'rounded-r',
    spaceX: isRTL ? 'space-x-reverse' : '',
    flexRow: isRTL ? 'flex-row-reverse' : 'flex-row'
  };
};

/**
 * Get localized number format
 */
export const formatLocalizedNumber = (number: number, language: string): string => {
  const locale = getLocalizedDateFormat(language);
  return new Intl.NumberFormat(locale).format(number);
};

/**
 * Get localized currency format
 */
export const formatLocalizedCurrency = (amount: number, currency: string, language: string): string => {
  const locale = getLocalizedDateFormat(language);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || 'USD'
  }).format(amount);
};

/**
 * Get localized role text
 */
export const getLocalizedRole = (role: string, t: TFunction): string => {
  const roleMap: Record<string, string> = {
    'STUDENT': t('common.student'),
    'PARENT': t('common.parent'),
    'DRIVER': t('common.driver'),
    'ADMIN': t('header.adminRole'),
    'AGENT': t('table.agentName')
  };
  
  return roleMap[role.toUpperCase()] || role;
};

/**
 * Get localized gender text
 */
export const getLocalizedGender = (gender: string, t: TFunction): string => {
  const genderMap: Record<string, string> = {
    'MALE': t('common.male'),
    'FEMALE': t('common.female')
  };
  
  return genderMap[gender.toUpperCase()] || gender;
};

/**
 * Get localized academic level text
 */
export const getLocalizedAcademicLevel = (level: string, t: TFunction): string => {
  const levelMap: Record<string, string> = {
    'PRIMARY': t('users.primary'),
    'SECONDARY': t('users.secondary'),
    'UNIVERSITY': t('users.university')
  };
  
  return levelMap[level.toUpperCase()] || level;
};