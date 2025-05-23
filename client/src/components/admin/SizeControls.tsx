import { useState, useEffect } from 'react';
import { Link, Unlink, RotateCcw, Info } from 'lucide-react';

interface SizeControlsProps {
  width?: number;
  height?: number;
  scale?: number;
  lockAspectRatio?: boolean;
  onChange: (settings: {
    width?: number;
    height?: number;
    scale?: number;
    lockAspectRatio?: boolean;
  }) => void;
  className?: string;
  label?: string;
  showPresets?: boolean;
  showTooltip?: boolean;
}

const SCALE_PRESETS = [25, 50, 75, 100, 125, 150];

const SIZE_PRESETS = {
  thumbnail: { width: 300, height: 200, label: 'Thumbnail' },
  card: { width: 400, height: 300, label: 'Card' },
  hero: { width: 800, height: 450, label: 'Hero' },
  gallery: { width: 600, height: 400, label: 'Gallery' },
  fullwidth: { width: 1200, height: 675, label: 'Full Width' }
};

const SizeControls = ({
  width = 400,
  height = 300,
  scale = 100,
  lockAspectRatio = true,
  onChange,
  className = '',
  label = 'Size Controls',
  showPresets = true,
  showTooltip = true
}: SizeControlsProps) => {
  const [localWidth, setLocalWidth] = useState(width);
  const [localHeight, setLocalHeight] = useState(height);
  const [localScale, setLocalScale] = useState(scale);
  const [localLock, setLocalLock] = useState(lockAspectRatio);
  const [showTooltipState, setShowTooltipState] = useState(false);
  const [originalRatio, setOriginalRatio] = useState(width / height);

  useEffect(() => {
    setLocalWidth(width);
    setLocalHeight(height);
    setLocalScale(scale);
    setLocalLock(lockAspectRatio);
    setOriginalRatio(width / height);
  }, [width, height, scale, lockAspectRatio]);

  const handleWidthChange = (newWidth: number) => {
    setLocalWidth(newWidth);

    if (localLock) {
      const newHeight = Math.round(newWidth / originalRatio);
      setLocalHeight(newHeight);
      onChange({
        width: newWidth,
        height: newHeight,
        scale: localScale,
        lockAspectRatio: localLock
      });
    } else {
      onChange({
        width: newWidth,
        height: localHeight,
        scale: localScale,
        lockAspectRatio: localLock
      });
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setLocalHeight(newHeight);

    if (localLock) {
      const newWidth = Math.round(newHeight * originalRatio);
      setLocalWidth(newWidth);
      onChange({
        width: newWidth,
        height: newHeight,
        scale: localScale,
        lockAspectRatio: localLock
      });
    } else {
      onChange({
        width: localWidth,
        height: newHeight,
        scale: localScale,
        lockAspectRatio: localLock
      });
    }
  };

  const handleScaleChange = (newScale: number) => {
    setLocalScale(newScale);
    onChange({
      width: localWidth,
      height: localHeight,
      scale: newScale,
      lockAspectRatio: localLock
    });
  };

  const handleLockToggle = () => {
    const newLock = !localLock;
    setLocalLock(newLock);
    if (newLock) {
      setOriginalRatio(localWidth / localHeight);
    }
    onChange({
      width: localWidth,
      height: localHeight,
      scale: localScale,
      lockAspectRatio: newLock
    });
  };

  const handlePresetSelect = (preset: { width: number; height: number }) => {
    setLocalWidth(preset.width);
    setLocalHeight(preset.height);
    setOriginalRatio(preset.width / preset.height);
    onChange({
      width: preset.width,
      height: preset.height,
      scale: localScale,
      lockAspectRatio: localLock
    });
  };

  const resetToDefaults = () => {
    const defaultWidth = 400;
    const defaultHeight = 300;
    const defaultScale = 100;

    setLocalWidth(defaultWidth);
    setLocalHeight(defaultHeight);
    setLocalScale(defaultScale);
    setOriginalRatio(defaultWidth / defaultHeight);

    onChange({
      width: defaultWidth,
      height: defaultHeight,
      scale: defaultScale,
      lockAspectRatio: localLock
    });
  };

  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
        {showTooltip && (
          <div className="inline-block ml-2 relative">
            <Info
              size={14}
              className="text-gray-400 cursor-help"
              onMouseEnter={() => setShowTooltipState(true)}
              onMouseLeave={() => setShowTooltipState(false)}
            />
            {showTooltipState && (
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                Control image dimensions and scaling. Lock aspect ratio to maintain proportions.
              </div>
            )}
          </div>
        )}
      </label>

      {/* Size Presets */}
      {showPresets && (
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-600 mb-2">Size Presets:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SIZE_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {preset.label}
                <span className="text-gray-500 ml-1">
                  ({preset.width}×{preset.height})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Manual Size Controls */}
      <div className="space-y-4">
        {/* Width and Height */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Width (px)</label>
            <input
              type="number"
              value={localWidth}
              onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
              min="1"
              max="2000"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Height (px)</label>
            <input
              type="number"
              value={localHeight}
              onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
              min="1"
              max="2000"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Aspect Ratio Lock */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Lock Aspect Ratio</span>
          <button
            type="button"
            onClick={handleLockToggle}
            className={`flex items-center px-3 py-1 rounded-md text-sm transition-colors ${
              localLock
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {localLock ? <Link size={16} /> : <Unlink size={16} />}
            <span className="ml-1">{localLock ? 'Locked' : 'Unlocked'}</span>
          </button>
        </div>

        {/* Scale Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-600">Scale</label>
            <span className="text-sm font-medium text-gray-700">{localScale}%</span>
          </div>
          <input
            type="range"
            min="25"
            max="200"
            step="5"
            value={localScale}
            onChange={(e) => handleScaleChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>25%</span>
            <span>100%</span>
            <span>200%</span>
          </div>
        </div>

        {/* Scale Presets */}
        <div>
          <div className="text-sm text-gray-600 mb-2">Quick Scale:</div>
          <div className="flex flex-wrap gap-2">
            {SCALE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleScaleChange(preset)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  localScale === preset
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={resetToDefaults}
            className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <RotateCcw size={14} className="mr-1" />
            Reset to Defaults
          </button>
        </div>

        {/* Current Dimensions Display */}
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Dimensions:</span>
              <span className="font-medium">{localWidth} × {localHeight}px</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Aspect Ratio:</span>
              <span className="font-medium">{(localWidth / localHeight).toFixed(2)}:1</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Scale:</span>
              <span className="font-medium">{localScale}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeControls;
