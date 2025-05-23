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

  // Helper function to determine grid span for each image
  const getSpanClasses = (index: number): string => {
    // Create a simpler layout pattern for medium-sized images
    switch (index % 6) {
      case 0: // First item - featured (2x2)
        return 'col-span-2 row-span-2';
      case 1: // Second item - regular
        return 'col-span-1 row-span-1';
      case 2: // Third item - regular
        return 'col-span-1 row-span-1';
      case 3: // Fourth item - wide
        return 'col-span-2 row-span-1';
      case 4: // Fifth item - regular
        return 'col-span-1 row-span-1';
      case 5: // Sixth item - regular
        return 'col-span-1 row-span-1';
      default:
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
      <h3 className="text-2xl font-bold mb-6">Project Gallery</h3>

      <div
        ref={bentoGridRef}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[120px] md:auto-rows-[140px]"
      >
        {images.map((image, index) => {
          const spanClasses = getSpanClasses(index);

          return (
            <div
              key={index}
              className={`bento-item overflow-hidden rounded-lg shadow-md ${spanClasses}`}
            >
              <div className="relative group h-full w-full">
                <ResponsiveImage
                  src={image}
                  alt={`${projectTitle} - Image ${index + 1}`}
                  imageSettings={imageSettings}
                  globalSettings={globalSettings}
                  className="transition-transform duration-500 group-hover:scale-105"
                  containerClassName="h-full w-full absolute inset-0"
                  onError={(e) => {
                    console.error('Image failed to load:', image);
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 z-10"></div>

                {/* Image overlay with index */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {index + 1} / {images.length}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid pattern explanation for better UX */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        Images are displayed in a dynamic bento box layout - {images.length} images
      </div>
    </div>
  );
};

export default BentoBoxLayout;
