import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Circle, CircleDot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export const Hero: React.FC = () => {
  const { bannerImages, bannerInterval } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (bannerImages.length <= 1) return;

    const startTimer = () => {
      timerRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % bannerImages.length);
      }, bannerInterval);
    };

    startTimer();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [bannerImages.length, bannerInterval]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % bannerImages.length);
    resetTimer();
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + bannerImages.length) % bannerImages.length);
    resetTimer();
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    resetTimer();
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerImages.length);
    }, bannerInterval);
  };

  // No default banners - display placeholder if empty
  const displayImages = bannerImages;

  return (
    <div className="relative bg-white dark:bg-neutral-950 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white dark:bg-neutral-950 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 transition-colors duration-300">
          
          {/* Subtle pattern for light mode */}
          <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:hidden pointer-events-none"></div>

          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white dark:text-neutral-950 transform translate-x-1/2 transition-colors duration-300 drop-shadow-xl z-20"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="relative mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Shopping reimagined</span>{' '}
                <span className="block text-indigo-600 dark:text-gold-500 xl:inline">with Artificial Intelligence</span>
              </h1>
              <p className="mt-3 text-base text-slate-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 font-light">
                Discover a curated selection of premium products. Let <span className="font-semibold text-indigo-600 dark:text-gold-400">"Nex"</span>, our smart assistant, help you find exactly what you need in seconds.
              </p>
              <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                <div className="rounded-md shadow-lg shadow-indigo-500/20 dark:shadow-none">
                  <Link
                    to="/shop"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-gold-500 dark:hover:bg-gold-600 md:py-4 md:text-lg md:px-10 transition-all hover:-translate-y-0.5"
                  >
                    Start Shopping
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0">
                  <button
                    onClick={() => document.querySelector('.fixed.bottom-6')?.querySelector('button')?.click()}
                    className="w-full flex items-center justify-center px-8 py-3 border border-slate-200 dark:border-neutral-700 text-base font-medium rounded-xl text-indigo-700 bg-white hover:bg-slate-50 dark:text-gold-400 dark:bg-neutral-900 dark:hover:bg-neutral-800 md:py-4 md:text-lg md:px-10 transition-all hover:shadow-md"
                  >
                    Ask AI Assistant <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Hero Image Carousel Area */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 h-56 sm:h-72 md:h-96 lg:h-full relative group bg-slate-50 dark:bg-neutral-900">
        
        {/* Carousel Images */}
        {displayImages.length > 0 ? (
          displayImages.map((img, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <img
                className="h-full w-full object-cover"
                src={img}
                alt={`Banner ${index + 1}`}
              />
              {/* Overlay to darken image in dark mode */}
              <div className="absolute inset-0 bg-black opacity-0 dark:opacity-40 transition-opacity duration-300 pointer-events-none"></div>
              {/* Gradient overlay for light mode blending */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent opacity-100 dark:opacity-0 pointer-events-none lg:bg-gradient-to-l"></div>
            </div>
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-neutral-600 bg-slate-100 dark:bg-neutral-800">
             <div className="text-center p-6">
                <div className="text-6xl mb-4 opacity-50">🖼️</div>
                <p className="text-xl font-medium">No Banners Active</p>
                <p className="text-sm mt-2 opacity-70">Add banners via Admin Dashboard</p>
             </div>
          </div>
        )}

        {/* Carousel Controls */}
        {displayImages.length > 1 && (
          <>
            {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-sm text-white hover:bg-white/50 dark:hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-sm text-white hover:bg-white/50 dark:hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {displayImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`transition-all ${idx === currentSlide ? 'text-white scale-110' : 'text-white/50 hover:text-white/80'}`}
                >
                  {idx === currentSlide ? <CircleDot className="w-3 h-3 fill-current" /> : <Circle className="w-2.5 h-2.5 fill-current" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};