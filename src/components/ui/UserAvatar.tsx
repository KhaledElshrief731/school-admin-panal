import React from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  name: string;
  email?: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  email, 
  avatar, 
  size = 'md',
  showDetails = true 
}) => {
  const getSizeClasses = () => {
    const sizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    };
    
    return sizes[size];
  };

  const getIconSize = () => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };
    
    return sizes[size];
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${getSizeClasses()} bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0`}>
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <User className={`${getIconSize()} text-white`} />
        )}
      </div>
      {showDetails && (
        <div className="min-w-0 flex-1">
          <div className="font-medium text-white truncate">{name}</div>
          {email && (
            <div className="text-sm text-gray-400 truncate">{email}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;