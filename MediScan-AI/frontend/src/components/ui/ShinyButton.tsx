import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'emerald' | 'primary' | 'outline';
}

export const ShinyButton: React.FC<ShinyButtonProps> = ({
  children,
  className = '',
  variant = 'emerald',
  onClick,
  disabled,
  ...props
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold text-xs sm:text-sm rounded-xl px-4 py-2.5 overflow-hidden transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variantClasses = {
    emerald: 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 border border-primary/30',
    primary: 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 border border-primary/30',
    outline: 'border border-border bg-card hover:bg-accent text-foreground shadow-2xs',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      <motion.span
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: 3,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};
