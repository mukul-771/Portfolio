import { useState, useRef } from 'react';
import { Camera, X, Plus, Settings } from 'lucide-react';
import { projectApi } from '../../services/jsonApi';
import type { ImageSettings } from '../../types/project';
import ImageSettingsPanel from './ImageSettingsPanel';

interface MultipleImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  label: string;
  maxImages?: number;
  imageSettings?: ImageSettings;
  onImageSettingsChange?: (settings: ImageSettings) => void;
  showImageSettings?: boolean;
  globalSettings?: ImageSettings;
}

const MultipleImageUpload = ({
  images,
  onImagesChange,
  label,
  maxImages = 10,
  imageSettings,
  onImageSettingsChange,
  showImageSettings = false,
  globalSettings
}: MultipleImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    setIsUploading(true);

    try {
      const uploadPromises = files.map(file => projectApi.uploadImage(file));
      const results = await Promise.all(uploadPromises);

      const newImageUrls = results.map(result => `http://localhost:5001${result.imageUrl}`);
      const updatedImages = [...images, ...newImageUrls].slice(0, maxImages);

      onImagesChange(updatedImages);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  // Trigger file input
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label} ({images.length}/{maxImages})
        </label>
        {showImageSettings && onImageSettingsChange && (
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Settings size={16} className="mr-1" />
            Image Settings
          </button>
        )}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square border rounded-lg overflow-hidden bg-gray-100">
              <img
                src={imageUrl}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Add More Button */}
        {images.length < maxImages && (
          <div
            onClick={triggerFileUpload}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-6 w-6 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs text-blue-500">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <Plus size={24} className="mb-2" />
                <span className="text-xs">Add Images</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
      />

      {/* Image Settings Panel */}
      {showSettings && showImageSettings && imageSettings && onImageSettingsChange && (
        <div className="mt-6">
          <ImageSettingsPanel
            imageUrl={images[0] || 'https://via.placeholder.com/400x300?text=Sample+Image'}
            settings={imageSettings}
            onChange={onImageSettingsChange}
            title="Gallery Image Settings"
            showPreview={true}
            showGlobalActions={true}
            globalSettings={globalSettings}
            onApplyGlobal={() => {
              if (globalSettings) {
                onImageSettingsChange(globalSettings);
              }
            }}
          />
        </div>
      )}

      {/* Instructions */}
      <p className="text-xs text-gray-500">
        Click to upload multiple images. Maximum {maxImages} images allowed.
        {showImageSettings ? ' Use Image Settings to control how images are displayed.' : ' Images will maintain their original aspect ratios.'}
      </p>
    </div>
  );
};

export default MultipleImageUpload;
