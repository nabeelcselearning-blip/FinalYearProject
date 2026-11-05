import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AuroraBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* 
        Modified Aurora Background
        - Scope: Behind Hero Section Only
        - Opacity: 3% (opacity-[0.03])
        - Colors: Warm Bronze Accent (#A67C52), desaturated, no bright blue or purple
      */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]">
        <motion.div
          initial={{ opacity: 0.5, scale: 0.95 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.95, 1.05, 0.95],
            x: ['-5%', '5%', '-5%'],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-3xl transform-gpu will-change-transform"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(166, 124, 82, 0.35) 0%, rgba(124, 154, 94, 0.2) 50%, rgba(0,0,0,0) 80%)',
          }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
};
