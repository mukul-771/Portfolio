import { useState } from 'react';
import { Info, Maximize, Minimize, Square } from 'lucide-react';

interface ImageFitSelectorProps {
  value: 'cover' | 'contain' | 'fill';
  onChange: (fitBehavior: 'cover' | 'contain' | 'fill') => void;
  className?: string;
  label?: string;
  showTooltip?: boolean;
}

const FIT_OPTIONS = [
  {
    value: 'cover' as const,
    label: 'Cover',
    description: 'Image fills container completely, may crop excess',
    icon: Maximize,
    example: 'Fills entire space, crops if needed'
  },
  {
    value: 'contain' as const,
    label: 'Contain',
    description: 'Entire image visible, may have empty space',
    icon: Minimize,
    example: 'Shows full image, adds padding if needed'
  },
  {
    value: 'fill' as const,
    label: 'Fill',
    description: 'Stretches image to fill container exactly',
    icon: Square,
    example: 'Stretches to fit, may distort image'
  }
];

const ImageFitSelector = ({
  value,
  onChange,
  className = '',
  label = 'Image Fit Behavior',
  showTooltip = true
}: ImageFitSelectorProps) => {
  const [showTooltipState, setShowTooltipState] = useState(false);

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
              <div className="absolute bottom-full left-0 mb-2 w-72 p-3 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                <div className="font-medium mb-1">Image Fit Options:</div>
                <div className="space-y-1">
                  <div><strong>Cover:</strong> Fills container, may crop image</div>
                  <div><strong>Contain:</strong> Shows full image, may add padding</div>
                  <div><strong>Fill:</strong> Stretches image to exact size</div>
                </div>
              </div>
            )}
          </div>
        )}
      </label>

      <div className="space-y-3">
        {FIT_OPTIONS.map((option) => {
          const IconComponent = option.icon;
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="fitBehavior"
                value={option.value}
                checked={isSelected}
                onChange={(e) => onChange(e.target.value as 'cover' | 'contain' | 'fill')}
                className="sr-only"
              />

              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <IconComponent size={16} />
              </div>

              <div className="flex-grow">
                <div className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                  {option.label}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {option.description}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {option.example}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Visual Examples */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-700 mb-3">Visual Examples:</div>
        <div className="grid grid-cols-3 gap-4">
          {FIT_OPTIONS.map((option) => (
            <div key={option.value} className="text-center">
              <div className={`w-full h-16 border-2 rounded mb-2 relative overflow-hidden ${
                value === option.value ? 'border-blue-500' : 'border-gray-300'
              }`}>
                {/* Container */}
                <div className="absolute inset-0 bg-gray-100">
                  {/* Sample Image Representation */}
                  <div
                    className={`bg-gradient-to-br from-blue-400 to-purple-500 ${
                      option.value === 'cover'
                        ? 'w-full h-full object-cover'
                        : option.value === 'contain'
                        ? 'w-3/4 h-3/4 mx-auto mt-2 object-contain'
                        : 'w-full h-full object-fill'
                    }`}
                    style={{
                      ...(option.value === 'fill' && { transform: 'scaleX(1.2)' })
                    }}
                  />

                  {/* Show cropping indicator for cover */}
                  {option.value === 'cover' && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full opacity-60"
                         title="May crop image" />
                  )}

                  {/* Show padding indicator for contain */}
                  {option.value === 'contain' && (
                    <div className="absolute inset-0 border-2 border-dashed border-gray-400 opacity-30"
                         title="May add padding" />
                  )}

                  {/* Show distortion indicator for fill */}
                  {option.value === 'fill' && (
                    <div className="absolute bottom-1 left-1 text-xs text-red-600 opacity-60"
                         title="May distort">⚠</div>
                  )}
                </div>
              </div>
              <div className={`text-xs font-medium ${
                value === option.value ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {option.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageFitSelector;
