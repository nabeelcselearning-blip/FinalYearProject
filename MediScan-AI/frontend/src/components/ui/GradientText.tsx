import React from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({ children, className = '' }) => {
  return (
    <span
      className={cn(
        'bg-gradient-to-r from-sky-500 via-primary to-emerald-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] font-extrabold',
        className
      )}
    >
      {children}
    </span>
  );
};
