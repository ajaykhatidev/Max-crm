'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

export interface SlideItem {
  eyebrow: string;
  title: string;
  description: string;
  metric: string;
  caption: string;
}

export default function FeatureSlider({
  slides,
  className = '',
}: {
  slides: SlideItem[];
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length, isPaused]);

  const activeSlide = slides[activeIndex];

  if (!activeSlide) return null;

  return (
    <section 
      className={`panel-strong soft-ring overflow-hidden rounded-[32px] ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="p-6 md:p-8">
        {/* Main Slide Content */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/50 bg-white/40 p-1">
          <div className="hero-mesh min-h-[280px] flex items-center rounded-[26px] p-6 md:p-10">
            <div key={activeIndex} className="flex h-full w-full flex-col animate-in fade-in slide-in-from-right-4 duration-700 ease-out">
              <p className="text-xs font-bold tracking-[0.3em] text-[var(--accent-strong)] uppercase opacity-80">
                {activeSlide.eyebrow}
              </p>
              
              <h2 className="font-display mt-5 text-5xl font-semibold leading-[1.1] text-[var(--text)] md:text-7xl max-w-4xl">
                {activeSlide.title}
              </h2>

              <div className="mt-auto pt-12 flex items-center justify-between">
                <div className="flex gap-2">
                  {slides.map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-[var(--line)]'}`}
                    />
                  ))}
                </div>
                
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveIndex((activeIndex - 1 + slides.length) % slides.length)}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] bg-white/80 text-[var(--text)] shadow-sm transition-all hover:scale-105 hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-95"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveIndex((activeIndex + 1) % slides.length)}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] bg-white/80 text-[var(--text)] shadow-sm transition-all hover:scale-105 hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-95"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
              <div 
                key={activeIndex + (isPaused ? '-paused' : '-active')}
                className={`h-full bg-[var(--accent)] transition-all duration-[5000ms] ease-linear ${isPaused ? 'w-0 opacity-0' : 'w-full'}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
