import { useState } from 'react';
import { Monitor, Tablet, Smartphone, Eye, ExternalLink } from 'lucide-react';
import type { ImageSettings } from '../../types/project';
import ResponsiveImage from '../ui/ResponsiveImage';

interface LiveWebsitePreviewProps {
  imageUrl: string;
  imageSettings: ImageSettings;
  projectTitle?: string;
  previewContext?: 'card' | 'hero' | 'gallery';
  className?: string;
}

const VIEWPORT_SIZES = {
  desktop: { width: 1200, height: 800, icon: Monitor, label: 'Desktop' },
  tablet: { width: 768, height: 1024, icon: Tablet, label: 'Tablet' },
  mobile: { width: 375, height: 667, icon: Smartphone, label: 'Mobile' }
};

const PREVIEW_CONTEXTS = {
  card: {
    label: 'Project Card',
    description: 'How it appears in project listings',
    containerClass: 'w-80 bg-white rounded-lg shadow-md overflow-hidden',
    imageContainerClass: 'h-48'
  },
  hero: {
    label: 'Hero Image',
    description: 'How it appears on project detail pages',
    containerClass: 'w-full bg-white rounded-lg shadow-md overflow-hidden',
    imageContainerClass: 'h-64'
  },
  gallery: {
    label: 'Gallery Image',
    description: 'How it appears in image galleries',
    containerClass: 'w-64 bg-white rounded-lg shadow-md overflow-hidden',
    imageContainerClass: 'h-64'
  }
};

const LiveWebsitePreview = ({
  imageUrl,
  imageSettings,
  projectTitle = 'Sample Project',
  previewContext = 'card',
  className = ''
}: LiveWebsitePreviewProps) => {
  const [activeViewport, setActiveViewport] = useState<keyof typeof VIEWPORT_SIZES>('desktop');
  const [activeContext, setActiveContext] = useState(previewContext);

  const context = PREVIEW_CONTEXTS[activeContext];

  // Scale factor based on viewport
  const getScaleFactor = () => {
    switch (activeViewport) {
      case 'mobile': return 0.4;
      case 'tablet': return 0.6;
      default: return 0.8;
    }
  };

  const scaleFactor = getScaleFactor();

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Eye size={20} className="text-blue-600 mr-2" />
          <div>
            <h3 className="text-lg font-medium text-gray-800">Live Preview</h3>
            <p className="text-sm text-gray-500">See exactly how it will look on your website</p>
          </div>
        </div>
        <button
          type="button"
          className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ExternalLink size={14} className="mr-1" />
          Open in New Tab
        </button>
      </div>

      {/* Context Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preview Context
        </label>
        <div className="flex space-x-2">
          {Object.entries(PREVIEW_CONTEXTS).map(([key, ctx]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveContext(key as keyof typeof PREVIEW_CONTEXTS)}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                activeContext === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {ctx.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {context.description}
        </p>
      </div>

      {/* Viewport Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Device Preview
        </label>
        <div className="flex space-x-2">
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
      </div>

      {/* Preview Container */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 min-h-96">
        <div className="flex justify-center items-center h-full">
          {/* Simulated Website Context */}
          <div 
            className="transition-all duration-300"
            style={{ 
              transform: `scale(${scaleFactor})`,
              transformOrigin: 'center'
            }}
          >
            {/* Project Card Preview */}
            {activeContext === 'card' && (
              <div className={context.containerClass}>
                <div className={context.imageContainerClass}>
                  <ResponsiveImage
                    src={imageUrl}
                    alt={projectTitle}
                    imageSettings={imageSettings}
                    containerClassName="h-full w-full"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{projectTitle}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    This is how your project will appear in the portfolio grid.
                  </p>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">React</span>
                    <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded">Design</span>
                  </div>
                </div>
              </div>
            )}

            {/* Hero Image Preview */}
            {activeContext === 'hero' && (
              <div className={context.containerClass}>
                <div className={context.imageContainerClass}>
                  <ResponsiveImage
                    src={imageUrl}
                    alt={projectTitle}
                    imageSettings={imageSettings}
                    containerClassName="h-full w-full"
                  />
                </div>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{projectTitle}</h1>
                  <p className="text-gray-600">
                    This is how your hero image will appear on the project detail page.
                  </p>
                </div>
              </div>
            )}

            {/* Gallery Image Preview */}
            {activeContext === 'gallery' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Project Gallery</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className={context.containerClass}>
                    <ResponsiveImage
                      src={imageUrl}
                      alt={`${projectTitle} - Image 1`}
                      imageSettings={imageSettings}
                      containerClassName={context.imageContainerClass}
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="w-64 bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Other Images</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Info */}
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500">
            Viewing on {VIEWPORT_SIZES[activeViewport].label} 
            ({VIEWPORT_SIZES[activeViewport].width}×{VIEWPORT_SIZES[activeViewport].height}px)
            • Scale: {Math.round(scaleFactor * 100)}%
          </div>
        </div>
      </div>

      {/* Settings Summary */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <div className="text-sm text-blue-800">
          <div className="font-medium mb-1">Current Settings:</div>
          <div className="text-xs space-y-1">
            <div>Shape: {imageSettings.aspectRatio === 'original' ? 'Original' : imageSettings.aspectRatio}</div>
            <div>Fit: {imageSettings.fitBehavior}</div>
            <div>Size: {imageSettings.scale || 100}%</div>
          </div>
        </div>
      </div>

      {/* Before/After Toggle */}
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Show Before/After Comparison
        </button>
      </div>
    </div>
  );
};

export default LiveWebsitePreview;
