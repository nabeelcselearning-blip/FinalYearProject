import React, { useEffect, useState } from 'react';

interface NumberTickerProps {
  value: number;
  duration?: number; // duration in ms
  className?: string;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({ value, duration = 1200, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;
    const endValue = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad formula for smooth decelerating count
      const easeOut = 1 - (1 - progress) * (1 - progress);
      setDisplayValue(Math.floor(easeOut * (endValue - startValue) + startValue));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span className={className}>{displayValue}</span>;
};
