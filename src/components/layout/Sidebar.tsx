import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDirection } from '../../hooks/useDirection';
import {
  LayoutDashboard,
  School,
  Users,
  UserSquare,
  CreditCard,
  FileText,
  Settings,
  Bell,
  Home,
  UserCog,
  FileEdit,
  ShieldCheck,
  Cog,
  MapPin,
  Globe,
  MessageCircle
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const navItems = [
    { name: t('navigation.dashboard'), path: '/', icon: <LayoutDashboard className="w-5 h-5" />, isNew: false },
    //{ name: t('navigation.home'), path: '/home', icon: <Home className="w-5 h-5" />, isNew: false },
 //   { name: t('navigation.agents'), path: '/agents', icon: <UserSquare className="w-5 h-5" />, isNew: true },
   // { name: t('navigation.schools'), path: '/schools', icon: <School className="w-5 h-5" />, isNew: false },
    { name: t('navigation.school'), path: '/school', icon: <School className="w-5 h-5" />, isNew: false },
    { name: t('navigation.city'), path: '/city', icon: <MapPin className="w-5 h-5" />, isNew: false },
    { name: t('navigation.country'), path: '/country', icon: <Globe className="w-5 h-5" />, isNew: false },
    { name: t('navigation.drivers'), path: '/drivers', icon: <Users className="w-5 h-5" />, isNew: true },
    { name: t('navigation.groups'), path: '/groups', icon: <MapPin className="w-5 h-5" />, isNew: true },
    { name: t('navigation.trips'), path: '/trips', icon: <MapPin className="w-5 h-5" />, isNew: true },
    { name: t('navigation.users'), path: '/users', icon: <UserCog className="w-5 h-5" />, isNew: false },
    { name: t('navigation.plans'), path: '/plans', icon: <CreditCard className="w-5 h-5" />, isNew: true },
    { name: t('navigation.subscriptions'), path: '/subscriptions', icon: <CreditCard className="w-5 h-5" />, isNew: true },
    { name: t('navigation.notifications'), path: '/notifications', icon: <Bell className="w-5 h-5" />, isNew: true },
    { name: t('navigation.contactUs'), path: '/contact-us', icon: <MessageCircle className="w-5 h-5" />, isNew: true },
    { name: t('navigation.content'), path: '/content', icon: <FileEdit className="w-5 h-5" />, isNew: true },
    { name: t('navigation.ads'), path: '/ads', icon: <FileText className="w-5 h-5" />, isNew: true },
    //{ name: t('navigation.roles'), path: '/roles', icon: <ShieldCheck className="w-5 h-5" />, isNew: true },
    { name: t('navigation.systemSettings'), path: '/system-settings', icon: <Cog className="w-5 h-5" />, isNew: true },
  ];

  return (
    <aside
      className={`bg-dark-300 h-full transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-16'
      } relative ${isRTL ? 'border-l border-dark-200' : 'border-r border-dark-200'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-4">
        <div className={`flex items-center justify-center mb-8 ${isExpanded ? 'px-2' : 'px-0'}`}>
          {isExpanded ? (
            <h1 className="text-lg font-bold text-white">{t('auth.platformTitle')}</h1>
          ) : (
            <School className="w-6 h-6 text-white" />
          )}
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative flex items-center px-3 py-2.5 rounded-lg gap-3 ${
                  isRTL ? 'text-right' : 'text-left'
                }
                transition-all duration-200 ease-in-out
                ${isActive ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-dark-200'}
                ${!isExpanded && 'justify-center'}
              `}
            >
              {item.icon}
              <span className={`whitespace-nowrap transition-all duration-200 ${
                isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              }`}>
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;