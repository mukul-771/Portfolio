import { useState } from 'react';
import { Monitor, Tablet, Smartphone, Info, Eye } from 'lucide-react';
import type { ImageSettings } from '../../types/project';

interface ResponsivePreviewProps {
  imageUrl: string;
  imageSettings: ImageSettings;
  className?: string;
  label?: string;
  showFileInfo?: boolean;
}

const VIEWPORT_SIZES = {
  desktop: { width: 1200, height: 800, icon: Monitor, label: 'Desktop' },
  tablet: { width: 768, height: 1024, icon: Tablet, label: 'Tablet' },
  mobile: { width: 375, height: 667, icon: Smartphone, label: 'Mobile' }
};

const ResponsivePreview = ({
  imageUrl,
  imageSettings,
  className = '',
  label = 'Responsive Preview',
  showFileInfo = true
}: ResponsivePreviewProps) => {
  const [activeViewport, setActiveViewport] = useState<keyof typeof VIEWPORT_SIZES>('desktop');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageLoaded(true);
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const getImageStyles = (viewport: keyof typeof VIEWPORT_SIZES) => {
    const { aspectRatio, customAspectRatio, fitBehavior, width, height, scale = 100 } = imageSettings;
    const viewportSize = VIEWPORT_SIZES[viewport];
    
    let containerWidth = Math.min(viewportSize.width * 0.8, width || 400);
    let containerHeight = height || 300;

    // Apply aspect ratio
    if (aspectRatio && aspectRatio !== 'original') {
      if (aspectRatio === 'custom' && customAspectRatio) {
        const [w, h] = customAspectRatio.split(':').map(Number);
        if (w && h) {
          containerHeight = (containerWidth * h) / w;
        }
      } else if (aspectRatio !== 'custom') {
        const [w, h] = aspectRatio.split(':').map(Number);
        if (w && h) {
          containerHeight = (containerWidth * h) / w;
        }
      }
    }

    // Apply scale
    const scaleFactor = scale / 100;
    containerWidth *= scaleFactor;
    containerHeight *= scaleFactor;

    return {
      container: {
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        maxWidth: '100%'
      },
      image: {
        width: '100%',
        height: '100%',
        objectFit: fitBehavior as 'cover' | 'contain' | 'fill'
      }
    };
  };

  const getFileSize = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const bytes = parseInt(contentLength);
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      }
    } catch (error) {
      console.error('Error getting file size:', error);
    }
    return 'Unknown';
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex items-center space-x-1">
          <Eye size={16} className="text-gray-400" />
          <span className="text-xs text-gray-500">Live Preview</span>
        </div>
      </div>

      {/* Viewport Selector */}
      <div className="flex space-x-2 mb-4">
        {Object.entries(VIEWPORT_SIZES).map(([key, viewport]) => {
          const IconComponent = viewport.icon;
          const isActive = activeViewport === key;
          
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveViewport(key as keyof typeof VIEWPORT_SIZES)}
              className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <IconComponent size={16} className="mr-2" />
              {viewport.label}
            </button>
          );
        })}
      </div>

      {/* Preview Container */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-center">
          <div 
            className="border border-gray-400 rounded-lg overflow-hidden bg-white shadow-sm"
            style={getImageStyles(activeViewport).container}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview"
                style={getImageStyles(activeViewport).image}
                onLoad={handleImageLoad}
                onError={handleImageError}
                className="transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Info size={24} className="mx-auto mb-2" />
                  <div className="text-sm">No image selected</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Viewport Info */}
        <div className="mt-3 text-center">
          <div className="text-xs text-gray-500">
            {VIEWPORT_SIZES[activeViewport].label} View 
            ({VIEWPORT_SIZES[activeViewport].width}×{VIEWPORT_SIZES[activeViewport].height}px)
          </div>
        </div>
      </div>

      {/* Image Information */}
      {showFileInfo && imageUrl && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-600">
            <div className="font-medium mb-2">Image Information:</div>
            
            {imageLoaded && imageDimensions && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Original Size:</span>
                  <span className="ml-1 font-medium">
                    {imageDimensions.width} × {imageDimensions.height}px
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Display Size:</span>
                  <span className="ml-1 font-medium">
                    {Math.round(parseFloat(getImageStyles(activeViewport).container.width))} × 
                    {Math.round(parseFloat(getImageStyles(activeViewport).container.height))}px
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Aspect Ratio:</span>
                  <span className="ml-1 font-medium">
                    {imageSettings.aspectRatio === 'original' 
                      ? `${(imageDimensions.width / imageDimensions.height).toFixed(2)}:1`
                      : imageSettings.aspectRatio === 'custom' 
                      ? imageSettings.customAspectRatio || 'Custom'
                      : imageSettings.aspectRatio
                    }
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Fit Behavior:</span>
                  <span className="ml-1 font-medium capitalize">{imageSettings.fitBehavior}</span>
                </div>
                <div>
                  <span className="text-gray-500">Scale:</span>
                  <span className="ml-1 font-medium">{imageSettings.scale || 100}%</span>
                </div>
              </div>
            )}

            {imageError && (
              <div className="text-red-500 text-xs">
                Failed to load image. Please check the URL.
              </div>
            )}

            {!imageLoaded && !imageError && imageUrl && (
              <div className="text-gray-500 text-xs">
                Loading image...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Summary */}
      <div className="mt-3 p-3 bg-blue-50 rounded-md">
        <div className="text-sm text-blue-800">
          <div className="font-medium mb-1">Current Settings:</div>
          <div className="text-xs space-y-1">
            <div>Aspect Ratio: {imageSettings.aspectRatio === 'custom' ? imageSettings.customAspectRatio : imageSettings.aspectRatio}</div>
            <div>Fit: {imageSettings.fitBehavior}</div>
            <div>Scale: {imageSettings.scale || 100}%</div>
            {imageSettings.width && imageSettings.height && (
              <div>Dimensions: {imageSettings.width} × {imageSettings.height}px</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsivePreview;
