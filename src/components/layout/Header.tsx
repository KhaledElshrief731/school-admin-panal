import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Filter, LogOut, Settings, UserCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import LanguageSwitcher from '../ui/LanguageSwitcher';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsDropdownOpen(false);
  };

  const handleProfile = () => {
    console.log('Navigate to profile...');
    setIsDropdownOpen(false);
  };

  const handleSettings = () => {
    navigate('/settings');
    setIsDropdownOpen(false);
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
        ease: 'easeIn',
      },
    },
  };

  return (
    <header className="bg-dark-300 border-b border-dark-200 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full p-2 pr-10 bg-dark-400 border border-dark-200 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              placeholder={t('header.searchPlaceholder')}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="h-6 w-6" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 h-4 w-4 bg-error-500 rounded-full flex items-center justify-center text-xs"
            >
              1
            </motion.span>
          </button>
          
          <Filter className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white transition-colors" />
          
          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 border-r border-dark-200 pr-4 hover:bg-dark-200 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="text-right">
                <span className="text-sm font-medium block">{t('header.adminName')}</span>
                <span className="text-xs text-gray-400">{t('header.adminRole')}</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary-600 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <ChevronDown 
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute left-0 mt-2 w-56 bg-dark-300 border border-dark-200 rounded-lg shadow-xl z-50"
                >
                  <div className="py-2">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-dark-200">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{t('header.adminName')}</div>
                          <div className="text-sm text-gray-400">{t('header.adminEmail')}</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={handleProfile}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-dark-200 hover:text-white transition-colors"
                      >
                        <UserCircle className="h-4 w-4" />
                        {t('header.profile')}
                      </button>
                      
                      <button
                        onClick={handleSettings}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-dark-200 hover:text-white transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        {t('header.settings')}
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-dark-200 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-error-400 hover:bg-error-600/10 hover:text-error-300 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        {t('header.logout')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;