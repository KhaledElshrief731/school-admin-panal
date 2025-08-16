// Arabic month names
const arabicMonths = [
  'يناير',
  'فبراير', 
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر'
];

// English month names
const englishMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

// Kurdish month names
const kurdishMonths = [
  'کانوونی دووەم',
  'شوبات',
  'ئازار',
  'نیسان',
  'ئایار',
  'حوزەیران',
  'تەمووز',
  'ئاب',
  'ئەیلوول',
  'تشرینی یەکەم',
  'تشرینی دووەم',
  'کانوونی یەکەم'
];

/**
 * Convert month number (1-12) to localized month name
 */
export const getLocalizedMonthName = (monthNumber: number, language: string = 'ar'): string => {
  if (monthNumber >= 1 && monthNumber <= 12) {
    switch (language) {
      case 'en':
        return englishMonths[monthNumber - 1];
      case 'ku':
        return kurdishMonths[monthNumber - 1];
      case 'ar':
      default:
        return arabicMonths[monthNumber - 1];
    }
  }
  
  switch (language) {
    case 'en':
      return 'Unknown';
    case 'ku':
      return 'نەناسراو';
    case 'ar':
    default:
      return 'غير معروف';
  }
};

/**
 * Convert month number (1-12) to Arabic month name (for backward compatibility)
 */
export const getArabicMonthName = (monthNumber: number): string => {
  return getLocalizedMonthName(monthNumber, 'ar');
};

/**
 * Convert monthly users data to chart format
 */
export const formatMonthlyUsersForChart = (monthlyUsers: Array<{ month: number; count: number }>, language: string = 'ar') => {
  return monthlyUsers.map(item => ({
    name: getLocalizedMonthName(item.month, language),
    value: item.count
  }));
};

/**
 * Convert monthly subscriptions data to chart format
 */
export const formatMonthlySubscriptionsForChart = (monthlySubscriptions: Array<{ month: number; paid: number; pending: number }>, language: string = 'ar') => {
  return monthlySubscriptions.map(item => ({
    name: getLocalizedMonthName(item.month, language),
    paid: item.paid,
    pending: item.pending
  }));
}; 

// Decode a JWT token and return its payload
export function decodeJWT(token: string): any {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
}

// Check if a JWT token is expired
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch {
    // If token is malformed, treat as expired
    return true;
  }
} 