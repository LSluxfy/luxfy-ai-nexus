import React from 'react';

// Ultra-optimized static skeleton - NO JavaScript, NO animations, NO lazy loading
const StaticHeroSkeleton: React.FC = () => {
  return (
    <div className="flex justify-center md:justify-end">
      <div className="hero-skeleton">
        <svg 
          className="w-12 h-12 text-slate-600" 
          fill="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
    </div>
  );
};

export default StaticHeroSkeleton;