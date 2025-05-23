import { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';

interface AspectRatioSelectorProps {
  value: string;
  customValue?: string;
  onChange: (aspectRatio: string, customValue?: string) => void;
  className?: string;
  label?: string;
  showTooltip?: boolean;
}

const PREDEFINED_RATIOS = [
  { value: '16:9', label: '16:9 (Landscape)', description: 'Wide landscape format, ideal for hero images' },
  { value: '4:3', label: '4:3 (Standard)', description: 'Traditional photo format' },
  { value: '1:1', label: '1:1 (Square)', description: 'Perfect for thumbnails and social media' },
  { value: '3:4', label: '3:4 (Portrait)', description: 'Vertical format, good for mobile displays' },
  { value: 'original', label: 'Original', description: 'Maintains uploaded image aspect ratio' },
  { value: 'custom', label: 'Custom', description: 'Define your own aspect ratio' }
];

const AspectRatioSelector = ({
  value,
  customValue = '',
  onChange,
  className = '',
  label = 'Aspect Ratio',
  showTooltip = true
}: AspectRatioSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState(customValue);
  const [showCustomTooltip, setShowCustomTooltip] = useState(false);

  const selectedRatio = PREDEFINED_RATIOS.find(ratio => ratio.value === value);

  const handleRatioSelect = (ratioValue: string) => {
    if (ratioValue === 'custom') {
      onChange(ratioValue, customInput);
    } else {
      onChange(ratioValue);
    }
    setIsOpen(false);
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomInput(newValue);
    if (value === 'custom') {
      onChange('custom', newValue);
    }
  };

  const validateCustomRatio = (ratio: string): boolean => {
    const pattern = /^\d+:\d+$/;
    return pattern.test(ratio);
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {showTooltip && (
          <div className="inline-block ml-2 relative">
            <Info 
              size={14} 
              className="text-gray-400 cursor-help"
              onMouseEnter={() => setShowCustomTooltip(true)}
              onMouseLeave={() => setShowCustomTooltip(false)}
            />
            {showCustomTooltip && (
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                Choose how images should be displayed. Different ratios work better for different contexts.
              </div>
            )}
          </div>
        )}
      </label>

      {/* Main Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <span className="flex items-center">
            <span className="font-medium">
              {selectedRatio?.label || 'Select Aspect Ratio'}
            </span>
            {value === 'custom' && customInput && (
              <span className="ml-2 text-sm text-gray-500">({customInput})</span>
            )}
          </span>
          <ChevronDown 
            size={20} 
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-64 overflow-y-auto">
            {PREDEFINED_RATIOS.map((ratio) => (
              <button
                key={ratio.value}
                type="button"
                onClick={() => handleRatioSelect(ratio.value)}
                className={`w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                  value === ratio.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div className="font-medium">{ratio.label}</div>
                <div className="text-sm text-gray-500 mt-1">{ratio.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom Ratio Input */}
      {value === 'custom' && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Custom Aspect Ratio
          </label>
          <input
            type="text"
            value={customInput}
            onChange={handleCustomInputChange}
            placeholder="e.g., 5:4, 21:9"
            className={`w-full p-2 border rounded-md text-sm ${
              customInput && !validateCustomRatio(customInput)
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {customInput && !validateCustomRatio(customInput) && (
            <p className="text-red-500 text-xs mt-1">
              Please enter a valid ratio format (e.g., 5:4, 21:9)
            </p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Enter width:height ratio (e.g., 5:4 for slightly wider than square)
          </p>
        </div>
      )}

      {/* Visual Preview */}
      {value !== 'original' && (
        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-2">Preview:</div>
          <div className="flex items-center space-x-2">
            {PREDEFINED_RATIOS
              .filter(r => r.value !== 'original' && r.value !== 'custom')
              .map((ratio) => {
                const [w, h] = ratio.value.split(':').map(Number);
                const isSelected = value === ratio.value;
                return (
                  <div
                    key={ratio.value}
                    className={`border-2 ${
                      isSelected ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    style={{
                      width: `${Math.min(w * 8, 48)}px`,
                      height: `${Math.min(h * 8, 48)}px`,
                      maxWidth: '48px',
                      maxHeight: '48px'
                    }}
                    title={ratio.label}
                  >
                    <div className={`w-full h-full ${
                      isSelected ? 'bg-blue-100' : 'bg-gray-100'
                    }`} />
                  </div>
                );
              })}
            {value === 'custom' && customInput && validateCustomRatio(customInput) && (
              <div className="border-2 border-blue-500">
                <div
                  className="bg-blue-100"
                  style={{
                    width: `${Math.min(parseInt(customInput.split(':')[0]) * 8, 48)}px`,
                    height: `${Math.min(parseInt(customInput.split(':')[1]) * 8, 48)}px`,
                    maxWidth: '48px',
                    maxHeight: '48px'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AspectRatioSelector;
