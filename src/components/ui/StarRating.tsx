import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  readonly?: boolean;
  onChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = true,
  readonly = true,
  onChange
}) => {
  const getSizeClasses = () => {
    const sizes = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };
    
    return sizes[size];
  };

  const handleStarClick = (starValue: number) => {
    if (!readonly && onChange) {
      onChange(starValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {showValue && (
        <span className="text-sm font-medium">({rating.toFixed(1)})</span>
      )}
      <div className="flex items-center gap-1">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.floor(rating);
          const isHalfFilled = starValue === Math.ceil(rating) && rating % 1 !== 0;
          
          return (
            <button
              key={index}
              onClick={() => handleStarClick(starValue)}
              disabled={readonly}
              className={`
                ${getSizeClasses()}
                ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                transition-transform
              `}
            >
              <Star
                className={`
                  ${getSizeClasses()}
                  ${isFilled || isHalfFilled 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-400'
                  }
                `}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StarRating;