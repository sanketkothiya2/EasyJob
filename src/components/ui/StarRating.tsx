'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          className={cn(
            'transition-colors duration-150',
            !readonly && 'cursor-pointer hover:scale-110',
            readonly && 'cursor-default'
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= displayValue
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            )}
          />
        </button>
      ))}
    </div>
  );
}
