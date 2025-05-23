import { useState, useEffect } from 'react';
import type { ImageSettings } from '../../types/project';
import {
  getImageStyles,
  getContainerStyles,
  getAspectRatioClasses,
  getObjectFitClasses,
  mergeImageSettings,
  hasWhiteSpaceRisk,
  fixWhiteSpaceIssues
} from '../../utils/imageSettings';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  imageSettings?: ImageSettings;
  globalSettings?: ImageSettings;
  className?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

const ResponsiveImage = ({
  src,
  alt,
  imageSettings,
  globalSettings,
  className = '',
  containerClassName = '',
  style,
  onClick,
  onError,
  loading = 'lazy',
  priority = false
}: ResponsiveImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Merge settings with priority: project settings > global settings > defaults
  const mergedSettings = mergeImageSettings(imageSettings, globalSettings);

  // Fix any white space issues automatically
  const finalSettings = hasWhiteSpaceRisk(mergedSettings)
    ? fixWhiteSpaceIssues(mergedSettings)
    : mergedSettings;

  // Get styles and classes
  const imageStyles = getImageStyles(finalSettings);
  const containerStyles = getContainerStyles(finalSettings);
  const aspectRatioClasses = getAspectRatioClasses(finalSettings);
  const objectFitClasses = getObjectFitClasses(finalSettings);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    setImageLoaded(false);

    // Set fallback image
    const target = e.currentTarget;
    target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';

    if (onError) {
      onError(e);
    }
  };

  // Reset states when src changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [src]);

  // Determine if we need to ensure the container has a minimum height
  const needsMinHeight = !aspectRatioClasses && !containerStyles.height && !containerStyles.aspectRatio;

  return (
    <div
      className={`relative overflow-hidden ${aspectRatioClasses} ${containerClassName} ${
        needsMinHeight ? 'min-h-[200px]' : ''
      }`}
      style={{
        ...containerStyles,
        // Ensure container fills available space when no specific dimensions are set
        ...(needsMinHeight && { height: '100%' })
      }}
      onClick={onClick}
    >
      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}

      {/* Error placeholder */}
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-500 text-sm text-center">
            <div className="mb-2">⚠️</div>
            <div>Image not found</div>
          </div>
        </div>
      )}

      {/* Main image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full ${objectFitClasses} transition-all duration-300 ${className} ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          ...imageStyles,
          ...style,
          // Ensure image fills container completely
          minHeight: '100%',
          minWidth: '100%'
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={loading}
        {...(priority && { fetchPriority: 'high' as any })}
      />

      {/* Overlay for interactive images */}
      {onClick && (
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 cursor-pointer" />
      )}
    </div>
  );
};

export default ResponsiveImage;
