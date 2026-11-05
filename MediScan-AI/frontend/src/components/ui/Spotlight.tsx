import React from 'react';

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export const Spotlight: React.FC<SpotlightProps> = ({
  className = '',
  fill = 'rgba(2, 132, 199, 0.15)',
}) => {
  return (
    <div
      className={`pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-3xl opacity-60 transition-opacity ${className}`}
      style={{
        background: `radial-gradient(circle, ${fill} 0%, rgba(0,0,0,0) 70%)`,
      }}
    />
  );
};
