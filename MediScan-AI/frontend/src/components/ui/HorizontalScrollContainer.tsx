import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalScrollContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const HorizontalScrollContainer: React.FC<HorizontalScrollContainerProps> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const updateScrollButtons = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons, { passive: true });
      window.addEventListener('resize', updateScrollButtons);
    }
    return () => {
      if (el) el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [children]);

  const scrollByAmount = (amount: number) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftRef.current = containerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const stopDragging = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className={`relative flex items-center min-w-0 overflow-hidden group/hscroll ${className}`}>
      {/* Scroll Left Arrow Button Overlay */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 z-30 flex items-center pr-4 pl-1 bg-gradient-to-r from-card via-card/90 to-transparent pointer-events-none">
          <button
            type="button"
            onClick={() => scrollByAmount(-260)}
            className="pointer-events-auto p-1.5 rounded-full bg-card border border-border text-foreground shadow-md backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Scrollable Track */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onWheel={(e) => {
          if (containerRef.current && (e.deltaY !== 0 || e.deltaX !== 0)) {
            const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
            containerRef.current.scrollLeft += delta * 1.2;
          }
        }}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full select-none cursor-grab active:cursor-grabbing py-1 px-2"
      >
        {children}
      </div>

      {/* Scroll Right Arrow Button Overlay */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 z-30 flex items-center pl-4 pr-1 bg-gradient-to-l from-card via-card/90 to-transparent pointer-events-none">
          <button
            type="button"
            onClick={() => scrollByAmount(260)}
            className="pointer-events-auto p-1.5 rounded-full bg-card border border-border text-foreground shadow-md backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
