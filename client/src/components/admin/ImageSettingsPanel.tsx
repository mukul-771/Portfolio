import { useState, useEffect } from 'react';
import { Settings, RotateCcw, Copy, Save, ChevronDown, ChevronUp, Wand2, Eye, Smartphone, Tablet, Monitor } from 'lucide-react';
import type { ImageSettings } from '../../types/project';
import SimplifiedImageControls from './SimplifiedImageControls';
import LiveWebsitePreview from './LiveWebsitePreview';

interface ImageSettingsPanelProps {
  imageUrl: string;
  settings: ImageSettings;
  onChange: (settings: ImageSettings) => void;
  onSave?: () => void;
  className?: string;
  title?: string;
  showPreview?: boolean;
  showGlobalActions?: boolean;
  globalSettings?: ImageSettings;
  onApplyGlobal?: () => void;
  onSaveAsGlobal?: () => void;
}

const DEFAULT_SETTINGS: ImageSettings = {
  aspectRatio: '16:9',
  fitBehavior: 'cover',
  width: 400,
  height: 300,
  scale: 100,
  lockAspectRatio: true
};

// Auto-optimization logic based on image context
const getOptimizedSettings = (context: 'thumbnail' | 'hero' | 'gallery'): ImageSettings => {
  switch (context) {
    case 'thumbnail':
      return {
        aspectRatio: '4:3',
        fitBehavior: 'cover',
        scale: 100,
        lockAspectRatio: true
      };
    case 'hero':
      return {
        aspectRatio: '16:9',
        fitBehavior: 'cover',
        scale: 100,
        lockAspectRatio: true
      };
    case 'gallery':
      return {
        aspectRatio: 'original',
        fitBehavior: 'contain',
        scale: 100,
        lockAspectRatio: true
      };
    default:
      return DEFAULT_SETTINGS;
  }
};

const ImageSettingsPanel = ({
  imageUrl,
  settings,
  onChange,
  onSave,
  className = '',
  title = 'Image Settings',
  showPreview = true,
  showGlobalActions = false,
  globalSettings,
  onApplyGlobal,
  onSaveAsGlobal
}: ImageSettingsPanelProps) => {
  const [localSettings, setLocalSettings] = useState<ImageSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  const handleSettingsChange = (newSettings: Partial<ImageSettings>) => {
    const updatedSettings = { ...localSettings, ...newSettings };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
    onChange(updatedSettings);
  };

  // Auto-optimize based on context (inferred from title)
  const handleAutoOptimize = () => {
    let context: 'thumbnail' | 'hero' | 'gallery' = 'thumbnail';

    if (title.toLowerCase().includes('hero')) context = 'hero';
    else if (title.toLowerCase().includes('gallery')) context = 'gallery';
    else if (title.toLowerCase().includes('thumbnail')) context = 'thumbnail';

    const optimizedSettings = getOptimizedSettings(context);
    setLocalSettings(optimizedSettings);
    setHasChanges(true);
    onChange(optimizedSettings);
  };

  const resetToDefaults = () => {
    setLocalSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
    onChange(DEFAULT_SETTINGS);
  };

  const applyGlobalSettings = () => {
    if (globalSettings && onApplyGlobal) {
      setLocalSettings(globalSettings);
      setHasChanges(true);
      onChange(globalSettings);
      onApplyGlobal();
    }
  };

  const saveAsGlobalSettings = () => {
    if (onSaveAsGlobal) {
      onSaveAsGlobal();
      setHasChanges(false);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
      setHasChanges(false);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Settings size={20} className="text-gray-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          {hasChanges && (
            <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
              Unsaved
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {showGlobalActions && (
            <>
              {globalSettings && (
                <button
                  type="button"
                  onClick={applyGlobalSettings}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  title="Apply global settings"
                >
                  <Copy size={14} className="mr-1" />
                  Apply Global
                </button>
              )}
              <button
                type="button"
                onClick={saveAsGlobalSettings}
                className="flex items-center px-3 py-1 text-sm text-green-600 hover:text-green-700 transition-colors"
                title="Save as global settings"
              >
                <Save size={14} className="mr-1" />
                Save as Global
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Settings size={16} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6">
          <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Simplified Controls */}
            <div>
              <SimplifiedImageControls
                settings={localSettings}
                onChange={handleSettingsChange}
                onAutoOptimize={handleAutoOptimize}
                onReset={resetToDefaults}
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                <div className="flex items-center space-x-3">
                  {showGlobalActions && (
                    <>
                      {globalSettings && (
                        <button
                          type="button"
                          onClick={applyGlobalSettings}
                          className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                          title="Apply global settings"
                        >
                          <Copy size={14} className="mr-1" />
                          Use Global
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={saveAsGlobalSettings}
                        className="flex items-center px-3 py-2 text-sm text-green-600 hover:text-green-700 transition-colors"
                        title="Save as global settings"
                      >
                        <Save size={14} className="mr-1" />
                        Save as Global
                      </button>
                    </>
                  )}
                </div>

                {onSave && (
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className={`flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-all ${
                      hasChanges
                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Save size={16} className="mr-2" />
                    {hasChanges ? 'Save Changes' : 'No Changes'}
                  </button>
                )}
              </div>
            </div>

            {/* Live Preview Panel */}
            {showPreview && (
              <div>
                <LiveWebsitePreview
                  imageUrl={imageUrl}
                  imageSettings={localSettings}
                  projectTitle="Sample Project"
                  previewContext={
                    title.toLowerCase().includes('hero') ? 'hero' :
                    title.toLowerCase().includes('gallery') ? 'gallery' : 'card'
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSettingsPanel;
