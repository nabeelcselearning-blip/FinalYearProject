import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ShinyButton } from './ShinyButton';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-10 sm:p-14 text-center rounded-2xl border bg-card/60 backdrop-blur-xs space-y-4 shadow-sm relative overflow-hidden"
    >
      <div className="relative w-16 h-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-md shadow-primary/10">
        <Icon className="w-8 h-8" />
        <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur-md -z-10 animate-pulse" />
      </div>

      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-base font-extrabold text-foreground tracking-tight">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {actionText && onAction && (
        <div className="pt-2">
          <ShinyButton onClick={onAction} variant="emerald">
            {actionText}
          </ShinyButton>
        </div>
      )}
    </motion.div>
  );
};
