import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { ImageSettings } from '../../types/project';
import ResponsiveImage from '../ui/ResponsiveImage';

interface BentoBoxLayoutProps {
  images: string[];
  projectTitle: string;
  imageSettings?: ImageSettings;
  globalSettings?: ImageSettings;
}

const BentoBoxLayout = ({ images, projectTitle, imageSettings, globalSettings }: BentoBoxLayoutProps) => {
  const bentoGridRef = useRef<HTMLDivElement>(null);

  // Animate the bento grid on mount
  useEffect(() => {
    if (bentoGridRef.current) {
      const gridItems = bentoGridRef.current.querySelectorAll('.bento-item');

      gsap.fromTo(
        gridItems,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        }
      );
    }
  }, [images]);

  // Helper function to determine grid span for each image - more uniform layout
  const getSpanClasses = (index: number, totalImages: number): string => {
    // For better visual balance, create a more uniform grid with occasional featured items
    if (totalImages === 1) {
      return 'col-span-2 md:col-span-3 row-span-2'; // Single image takes more space
    }

    if (totalImages === 2) {
      return 'col-span-1 md:col-span-2 row-span-2'; // Two images split evenly
    }

    // For 3+ images, create a more balanced layout
    switch (index % 8) {
      case 0: // First item - slightly featured
        return 'col-span-2 row-span-2';
      case 3: // Fourth item - wide
        return 'col-span-2 row-span-1';
      case 6: // Seventh item - wide
        return 'col-span-2 row-span-1';
      default: // Regular items
        return 'col-span-1 row-span-1';
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No images available for this project.
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold mb-8 text-center">Project Gallery</h3>

      <div
        ref={bentoGridRef}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[160px] md:auto-rows-[180px]"
      >
        {images.map((image, index) => {
          const spanClasses = getSpanClasses(index, images.length);

          return (
            <div
              key={index}
              className={`bento-item overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${spanClasses} bg-gray-100`}
            >
              <div className="relative group h-full w-full">
                <ResponsiveImage
                  src={image}
                  alt={`${projectTitle} - Image ${index + 1}`}
                  imageSettings={{
                    aspectRatio: 'original',
                    fitBehavior: 'cover',
                    ...imageSettings
                  }}
                  globalSettings={globalSettings}
                  className="transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                  containerClassName="h-full w-full absolute inset-0"
                  onError={() => {
                    console.error('Image failed to load:', image);
                  }}
                />

                {/* Enhanced overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"></div>

                {/* Image counter with better styling */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                  {index + 1} / {images.length}
                </div>

                {/* Zoom indicator */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced gallery info */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {images.length} {images.length === 1 ? 'Image' : 'Images'} • Hover to explore
        </div>
      </div>
    </div>
  );
};

export default BentoBoxLayout;
