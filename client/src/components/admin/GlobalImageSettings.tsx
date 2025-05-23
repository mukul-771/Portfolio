import { useState, useEffect } from 'react';
import { Globe, Save, RotateCcw, Settings, Monitor, Image, Grid, Wand2, Sparkles } from 'lucide-react';
import type { GlobalImageSettings, ImageSettings } from '../../types/project';
import ImageSettingsPanel from './ImageSettingsPanel';

interface GlobalImageSettingsProps {
  globalSettings: GlobalImageSettings;
  onChange: (settings: GlobalImageSettings) => void;
  onSave: () => void;
  className?: string;
}

const DEFAULT_GLOBAL_SETTINGS: GlobalImageSettings = {
  defaultThumbnailSettings: {
    aspectRatio: '4:3',
    fitBehavior: 'cover',
    width: 300,
    height: 225,
    scale: 100,
    lockAspectRatio: true
  },
  defaultHeroSettings: {
    aspectRatio: '16:9',
    fitBehavior: 'cover',
    width: 800,
    height: 450,
    scale: 100,
    lockAspectRatio: true
  },
  defaultGallerySettings: {
    aspectRatio: 'original',
    fitBehavior: 'contain',
    width: 600,
    height: 400,
    scale: 100,
    lockAspectRatio: true
  },
  responsiveBreakpoints: {
    mobile: 375,
    tablet: 768,
    desktop: 1200
  }
};

const SETTING_TYPES = [
  {
    key: 'defaultThumbnailSettings' as const,
    label: 'Thumbnail Images',
    description: 'Default settings for project card thumbnails',
    icon: Grid,
    sampleUrl: 'https://via.placeholder.com/400x300?text=Thumbnail+Preview'
  },
  {
    key: 'defaultHeroSettings' as const,
    label: 'Hero Images',
    description: 'Default settings for project detail page hero images',
    icon: Monitor,
    sampleUrl: 'https://via.placeholder.com/800x450?text=Hero+Image+Preview'
  },
  {
    key: 'defaultGallerySettings' as const,
    label: 'Gallery Images',
    description: 'Default settings for project gallery and screenshot images',
    icon: Image,
    sampleUrl: 'https://via.placeholder.com/600x400?text=Gallery+Image+Preview'
  }
];

const GlobalImageSettings = ({
  globalSettings,
  onChange,
  onSave,
  className = ''
}: GlobalImageSettingsProps) => {
  const [localSettings, setLocalSettings] = useState<GlobalImageSettings>(globalSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof GlobalImageSettings>('defaultThumbnailSettings');
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    setLocalSettings(globalSettings);
    setHasChanges(false);
  }, [globalSettings]);

  const handleSettingsChange = (
    settingType: keyof GlobalImageSettings,
    newSettings: ImageSettings | typeof globalSettings.responsiveBreakpoints
  ) => {
    const updatedSettings = {
      ...localSettings,
      [settingType]: newSettings
    };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
    onChange(updatedSettings);
  };

  const handleImageSettingsChange = (settingType: keyof GlobalImageSettings) => (settings: ImageSettings) => {
    handleSettingsChange(settingType, settings);
  };

  const handleBreakpointChange = (breakpoint: keyof typeof globalSettings.responsiveBreakpoints, value: number) => {
    const updatedBreakpoints = {
      ...localSettings.responsiveBreakpoints,
      [breakpoint]: value
    };
    handleSettingsChange('responsiveBreakpoints', updatedBreakpoints);
  };

  const resetToDefaults = () => {
    setLocalSettings(DEFAULT_GLOBAL_SETTINGS);
    setHasChanges(true);
    onChange(DEFAULT_GLOBAL_SETTINGS);
  };

  const handleSave = () => {
    onSave();
    setHasChanges(false);
  };

  // Auto-optimize all settings
  const handleOptimizeAll = async () => {
    setIsOptimizing(true);

    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 1500));

    const optimizedSettings: GlobalImageSettings = {
      defaultThumbnailSettings: {
        aspectRatio: '4:3',
        fitBehavior: 'cover',
        scale: 100,
        lockAspectRatio: true
      },
      defaultHeroSettings: {
        aspectRatio: '16:9',
        fitBehavior: 'cover',
        scale: 100,
        lockAspectRatio: true
      },
      defaultGallerySettings: {
        aspectRatio: 'original',
        fitBehavior: 'contain',
        scale: 100,
        lockAspectRatio: true
      },
      responsiveBreakpoints: {
        mobile: 375,
        tablet: 768,
        desktop: 1200
      }
    };

    setLocalSettings(optimizedSettings);
    setHasChanges(true);
    onChange(optimizedSettings);
    setIsOptimizing(false);
  };

  const getCurrentSettings = () => {
    const settingType = SETTING_TYPES.find(type => type.key === activeTab);
    if (settingType) {
      return localSettings[settingType.key] as ImageSettings;
    }
    return localSettings.defaultThumbnailSettings;
  };

  const getCurrentSampleUrl = () => {
    const settingType = SETTING_TYPES.find(type => type.key === activeTab);
    return settingType?.sampleUrl || SETTING_TYPES[0].sampleUrl;
  };

  return (
    <div className={`${className}`}>
      {/* Enhanced Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <Globe size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Global Image Settings</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Configure how images appear across your entire portfolio
                </p>
              </div>
              {hasChanges && (
                <span className="ml-4 px-3 py-1 text-xs bg-orange-100 text-orange-600 rounded-full font-medium">
                  • Unsaved Changes
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleOptimizeAll}
                disabled={isOptimizing}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  isOptimizing
                    ? 'bg-purple-100 text-purple-600 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600 shadow-md hover:shadow-lg'
                }`}
              >
                {isOptimizing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-300 border-t-purple-600 mr-2"></div>
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Wand2 size={16} className="mr-2" />
                    Auto-Optimize All
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetToDefaults}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <RotateCcw size={16} className="mr-1" />
                Reset All
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!hasChanges}
                className={`flex items-center px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                  hasChanges
                    ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save size={16} className="mr-2" />
                {hasChanges ? 'Save Changes' : 'All Saved'}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">3</div>
              <div className="text-xs text-blue-500">Image Types</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">
                {Object.keys(localSettings.responsiveBreakpoints).length}
              </div>
              <div className="text-xs text-green-500">Breakpoints</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-600">
                {hasChanges ? 'Modified' : 'Optimized'}
              </div>
              <div className="text-xs text-purple-500">Status</div>
            </div>
          </div>
        </div>

        {/* Responsive Breakpoints */}
        <div className="p-4">
          <h3 className="text-md font-medium text-gray-700 mb-3">Responsive Breakpoints</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(localSettings.responsiveBreakpoints).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm text-gray-600 mb-1 capitalize">
                  {key} (px)
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleBreakpointChange(
                    key as keyof typeof globalSettings.responsiveBreakpoints,
                    parseInt(e.target.value) || 0
                  )}
                  min="200"
                  max="2000"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            These breakpoints determine how images are displayed across different device sizes.
          </p>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-4" aria-label="Tabs">
            {SETTING_TYPES.map((settingType) => {
              const IconComponent = settingType.icon;
              const isActive = activeTab === settingType.key;

              return (
                <button
                  key={settingType.key}
                  type="button"
                  onClick={() => setActiveTab(settingType.key)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent size={16} className="mr-2" />
                  {settingType.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Tab Content */}
        <div className="p-4">
          {SETTING_TYPES.map((settingType) => (
            activeTab === settingType.key && (
              <div key={settingType.key}>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-1">
                    {settingType.label}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {settingType.description}
                  </p>
                </div>

                <ImageSettingsPanel
                  imageUrl={getCurrentSampleUrl()}
                  settings={getCurrentSettings()}
                  onChange={handleImageSettingsChange(settingType.key)}
                  title={`Default ${settingType.label} Settings`}
                  showPreview={true}
                  showGlobalActions={false}
                />
              </div>
            )
          ))}
        </div>
      </div>

      {/* Usage Information */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <Settings size={20} className="text-blue-600 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">
              How Global Settings Work
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• New projects will inherit these default settings automatically</li>
              <li>• Existing projects can apply global settings using the "Apply Global" button</li>
              <li>• Individual projects can override global settings with custom values</li>
              <li>• Changes to global settings don't affect existing projects unless explicitly applied</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalImageSettings;
