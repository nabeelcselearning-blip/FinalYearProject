import React from 'react';

export const TiltLogoCard: React.FC = () => {
  return (
    <div className="logo-wrapper large-logo-wrapper relative flex items-center justify-center p-0 rounded-[28px] cursor-pointer group max-w-[210px] sm:max-w-[250px] mx-auto select-none overflow-hidden">
      {/* ORIGINAL LOGO ARTWORK - 100% UNTOUCHED, UNCHANGED, UNFILTERED */}
      <img 
        src="/logo.png" 
        alt="MediScan AI Logo" 
        className="logo-image w-full h-full object-contain relative z-10 pointer-events-none rounded-[28px]" 
      />

      {/* CONTINUOUS HIGH-TECH LASER SCAN OVERLAY */}
      <div className="scan-bar-overlay">
        <div className="scan-bar" />
      </div>
    </div>
  );
};
