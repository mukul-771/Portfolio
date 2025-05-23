import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface MinimalToggleProps {
  leftOption: string;
  rightOption: string;
  defaultActive?: 'left' | 'right';
  onToggle: (active: 'left' | 'right') => void;
  className?: string;
  isDarkMode?: boolean;
}

const MinimalToggle = ({
  leftOption,
  rightOption,
  defaultActive = 'left',
  onToggle,
  className = '',
  isDarkMode = false,
}: MinimalToggleProps) => {
  const [active, setActive] = useState<'left' | 'right'>(defaultActive);
  const toggleRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Handle toggle change
  const handleToggle = (newActive: 'left' | 'right') => {
    if (active !== newActive) {
      setActive(newActive);
      onToggle(newActive);

      // Animate the slider
      if (sliderRef.current) {
        gsap.to(sliderRef.current, {
          x: newActive === 'right' ? '100%' : '0%',
          duration: 0.5,
          ease: 'power2.out',
        });
      }
    }
  };

  // Set initial position
  useEffect(() => {
    if (sliderRef.current) {
      gsap.set(sliderRef.current, {
        x: active === 'right' ? '100%' : '0%',
      });
    }
  }, []);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Toggle Container */}
      <div
        ref={toggleRef}
        className={`
          relative flex items-center justify-between mb-12 select-none
          w-64 mx-auto py-2 px-2 rounded-full shadow-md
          transition-colors duration-500
          ${isDarkMode ? 'bg-gray-800 shadow-gray-900/20' : 'bg-white shadow-md'}
        `}
      >
        {/* Background Slider */}
        <div
          ref={sliderRef}
          className={`
            absolute top-0 left-0 w-1/2 h-full rounded-full
            transition-colors duration-500 ease-in-out z-0
            ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}
          `}
        ></div>

        {/* Left Option */}
        <div
          onClick={() => handleToggle('left')}
          className={`
            relative z-10 w-1/2 py-3 text-center cursor-pointer
            font-medium text-base transition-all duration-500 ease-in-out
            ${active === 'left'
              ? isDarkMode ? 'text-blue-400' : 'text-blue-600'
              : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          {leftOption}
        </div>

        {/* Right Option */}
        <div
          onClick={() => handleToggle('right')}
          className={`
            relative z-10 w-1/2 py-3 text-center cursor-pointer
            font-medium text-base transition-all duration-300 ease-in-out
            ${active === 'right'
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          {rightOption}
        </div>
      </div>
    </div>
  );
};

export default MinimalToggle;
