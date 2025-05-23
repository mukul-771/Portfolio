import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import type { ImageSettings } from '../../types/project';
import ResponsiveImage from '../ui/ResponsiveImage';

interface ImageGalleryProps {
  images: string[];
  imageSettings?: ImageSettings;
  globalSettings?: ImageSettings;
}

const ImageGallery = ({ images, imageSettings, globalSettings }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Navigate to previous image
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // Navigate to next image
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // Open lightbox with specific image
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  };

  // Close lightbox
  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = ''; // Restore scrolling
  };

  // Navigate lightbox images
  const prevLightboxImage = () => {
    setLightboxIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'ArrowLeft') {
          prevLightboxImage();
        } else if (e.key === 'ArrowRight') {
          nextLightboxImage();
        } else if (e.key === 'Escape') {
          closeLightbox();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen]);

  // Animate image change
  useEffect(() => {
    if (galleryRef.current) {
      gsap.fromTo(
        galleryRef.current.querySelector('.main-image'),
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [currentIndex]);

  return (
    <div className="image-gallery" ref={galleryRef}>
      {/* Main Image */}
      <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-100">
        <div className="aspect-w-16 aspect-h-9 relative">
          <ResponsiveImage
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            imageSettings={imageSettings}
            globalSettings={globalSettings}
            className="main-image cursor-pointer"
            containerClassName="w-full h-full absolute inset-0"
            onClick={() => openLightbox(currentIndex)}
          />

          {/* Expand button */}
          <button
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
            onClick={() => openLightbox(currentIndex)}
          >
            <Maximize2 size={20} />
          </button>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="thumbnails-container overflow-x-auto" ref={thumbnailsRef}>
          <div className="flex space-x-2 py-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail-item flex-shrink-0 cursor-pointer rounded-md overflow-hidden transition-all ${
                  index === currentIndex ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ width: '80px', height: '60px' }}
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
            onClick={closeLightbox}
          >
            <X size={24} />
          </button>

          <div className="relative max-w-4xl max-h-[80vh] w-full">
            <img
              src={images[lightboxIndex]}
              alt={`Lightbox image ${lightboxIndex + 1}`}
              className="w-full h-full object-contain"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                onClick={prevLightboxImage}
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                onClick={nextLightboxImage}
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
