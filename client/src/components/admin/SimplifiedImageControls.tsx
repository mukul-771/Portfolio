import { useState } from 'react';
import { Wand2, RotateCcw, ChevronDown, ChevronUp, Image, Crop, Maximize2 } from 'lucide-react';
import type { ImageSettings } from '../../types/project';

interface SimplifiedImageControlsProps {
  settings: ImageSettings;
  onChange: (settings: ImageSettings) => void;
  onAutoOptimize: () => void;
  onReset: () => void;
  className?: string;
}

// Preset configurations for common use cases
const PRESETS = {
  'portfolio-thumbnail': {
    label: 'Portfolio Thumbnail',
    description: 'Perfect for project cards',
    icon: '🖼️',
    settings: {
      aspectRatio: '4:3',
      fitBehavior: 'cover' as const,
      scale: 100,
      lockAspectRatio: true
    }
  },
  'hero-image': {
    label: 'Hero Image',
    description: 'Large banner images',
    icon: '🌟',
    settings: {
      aspectRatio: '16:9',
      fitBehavior: 'cover' as const,
      scale: 100,
      lockAspectRatio: true
    }
  },
  'blog-post': {
    label: 'Blog Post',
    description: 'Article featured images',
    icon: '📝',
    settings: {
      aspectRatio: '3:2',
      fitBehavior: 'cover' as const,
      scale: 100,
      lockAspectRatio: true
    }
  },
  'square-social': {
    label: 'Square Social',
    description: 'Social media posts',
    icon: '📱',
    settings: {
      aspectRatio: '1:1',
      fitBehavior: 'cover' as const,
      scale: 100,
      lockAspectRatio: true
    }
  },
  'gallery-photo': {
    label: 'Gallery Photo',
    description: 'Photo collections',
    icon: '🖼️',
    settings: {
      aspectRatio: 'original',
      fitBehavior: 'contain' as const,
      scale: 100,
      lockAspectRatio: true
    }
  }
};

// Simplified aspect ratio options
const ASPECT_RATIOS = [
  { value: '16:9', label: 'Wide (16:9)', icon: '📺', description: 'Great for banners and hero images' },
  { value: '4:3', label: 'Standard (4:3)', icon: '🖼️', description: 'Classic photo format' },
  { value: '1:1', label: 'Square (1:1)', icon: '⬜', description: 'Perfect for thumbnails' },
  { value: '3:4', label: 'Portrait (3:4)', icon: '📱', description: 'Mobile-friendly vertical' },
  { value: 'original', label: 'Original', icon: '🔄', description: 'Keep uploaded size' }
];

// Simplified fit options
const FIT_OPTIONS = [
  { 
    value: 'cover' as const, 
    label: 'Fill Frame', 
    icon: <Maximize2 size={16} />, 
    description: 'Image fills entire space (may crop)' 
  },
  { 
    value: 'contain' as const, 
    label: 'Fit Inside', 
    icon: <Image size={16} />, 
    description: 'Show full image (may add padding)' 
  },
  { 
    value: 'fill' as const, 
    label: 'Stretch', 
    icon: <Crop size={16} />, 
    description: 'Stretch to exact size (may distort)' 
  }
];

const SimplifiedImageControls = ({
  settings,
  onChange,
  onAutoOptimize,
  onReset,
  className = ''
}: SimplifiedImageControlsProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Handle preset selection
  const handlePresetSelect = (presetKey: string) => {
    const preset = PRESETS[presetKey as keyof typeof PRESETS];
    if (preset) {
      setActivePreset(presetKey);
      onChange(preset.settings);
    }
  };

  // Handle aspect ratio change
  const handleAspectRatioChange = (aspectRatio: string) => {
    onChange({ ...settings, aspectRatio });
    setActivePreset(null); // Clear preset when manually changing
  };

  // Handle fit behavior change
  const handleFitChange = (fitBehavior: 'cover' | 'contain' | 'fill') => {
    onChange({ ...settings, fitBehavior });
    setActivePreset(null);
  };

  // Handle scale change
  const handleScaleChange = (scale: number) => {
    onChange({ ...settings, scale });
    setActivePreset(null);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quick Actions */}
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div>
          <h3 className="font-medium text-blue-900">Quick Setup</h3>
          <p className="text-sm text-blue-600">Let us optimize your image automatically</p>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onAutoOptimize}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Wand2 size={16} className="mr-2" />
            Auto-Optimize
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <RotateCcw size={16} className="mr-1" />
            Reset
          </button>
        </div>
      </div>

      {/* Preset Options */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">Choose a Style</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => handlePresetSelect(key)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                activePreset === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-2">{preset.icon}</div>
              <div className="font-medium text-gray-800">{preset.label}</div>
              <div className="text-sm text-gray-500">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Basic Controls */}
      <div className="space-y-4">
        {/* Aspect Ratio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Image Shape
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.value}
                type="button"
                onClick={() => handleAspectRatioChange(ratio.value)}
                className={`p-3 rounded-lg border text-center transition-all ${
                  settings.aspectRatio === ratio.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-lg mb-1">{ratio.icon}</div>
                <div className="text-xs font-medium">{ratio.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Fit Behavior */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How to Fit
          </label>
          <div className="grid grid-cols-3 gap-3">
            {FIT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleFitChange(option.value)}
                className={`p-4 rounded-lg border text-center transition-all ${
                  settings.fitBehavior === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-center mb-2">{option.icon}</div>
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Size Scale */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Size: {settings.scale || 100}%
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="50"
              max="150"
              step="10"
              value={settings.scale || 100}
              onChange={(e) => handleScaleChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>50% (Smaller)</span>
              <span>100% (Normal)</span>
              <span>150% (Larger)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Controls Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className="ml-1">
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </span>
        </button>

        {showAdvanced && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="text-sm text-gray-600">
              Advanced controls for fine-tuning (coming soon)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplifiedImageControls;
