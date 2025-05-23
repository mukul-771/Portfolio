import { useState, useRef, useCallback } from 'react';
import { Upload, X, Plus, Image, Settings, Eye, Wand2 } from 'lucide-react';
import { projectApi } from '../../services/jsonApi';
import type { ImageSettings } from '../../types/project';
import LiveWebsitePreview from './LiveWebsitePreview';

interface SimplifiedImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  label: string;
  maxImages?: number;
  imageSettings?: ImageSettings;
  onImageSettingsChange?: (settings: ImageSettings) => void;
  showImageSettings?: boolean;
  globalSettings?: ImageSettings;
  previewContext?: 'card' | 'hero' | 'gallery';
}

const SimplifiedImageUpload = ({
  images,
  onImagesChange,
  label,
  maxImages = 10,
  imageSettings,
  onImageSettingsChange,
  showImageSettings = false,
  globalSettings,
  previewContext = 'gallery'
}: SimplifiedImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setIsUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < Math.min(files.length, maxImages - images.length); i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const response = await projectApi.uploadImage(file);
          if (response.imageUrl) {
            newImages.push(response.imageUrl);
          }
        }
      }

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload some images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [images, maxImages, onImagesChange]);

  // Remove image
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  // Auto-optimize images
  const handleAutoOptimize = () => {
    if (onImageSettingsChange) {
      const optimizedSettings: ImageSettings = {
        aspectRatio: previewContext === 'hero' ? '16:9' : previewContext === 'card' ? '4:3' : 'original',
        fitBehavior: previewContext === 'gallery' ? 'contain' : 'cover',
        scale: 100,
        lockAspectRatio: true
      };
      onImageSettingsChange(optimizedSettings);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-lg font-medium text-gray-800">
            {label}
          </label>
          <p className="text-sm text-gray-500 mt-1">
            {images.length} of {maxImages} images uploaded
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {showImageSettings && onImageSettingsChange && (
            <>
              <button
                type="button"
                onClick={handleAutoOptimize}
                className="flex items-center px-3 py-2 text-sm bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <Wand2 size={16} className="mr-1" />
                Auto-Optimize
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  showPreview
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Eye size={16} className="mr-1" />
                Preview
              </button>
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  showSettings
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Settings size={16} className="mr-1" />
                Settings
              </button>
            </>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : images.length >= maxImages
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-300 border-t-blue-600 mb-4"></div>
            <p className="text-gray-600">Uploading images...</p>
          </div>
        ) : images.length >= maxImages ? (
          <div className="flex flex-col items-center text-gray-500">
            <Image size={48} className="mb-4" />
            <p className="text-lg font-medium">Maximum images reached</p>
            <p className="text-sm">Remove some images to upload more</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="p-4 bg-blue-100 rounded-full mb-4">
              <Upload size={32} className="text-blue-600" />
            </div>
            <p className="text-lg font-medium text-gray-800 mb-2">
              Drop images here or click to upload
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports JPG, PNG, GIF up to 10MB each
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Choose Images
            </button>
          </div>
        )}
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Preview */}
      {showPreview && images.length > 0 && imageSettings && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg">
          <LiveWebsitePreview
            imageUrl={images[0]}
            imageSettings={imageSettings}
            projectTitle="Sample Project"
            previewContext={previewContext}
          />
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && showImageSettings && imageSettings && onImageSettingsChange && (
        <div className="mt-6 p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Image Display Settings</h3>
          <p className="text-sm text-gray-500 mb-6">
            Control how these images appear on your website
          </p>
          {/* Settings controls would go here - simplified version */}
          <div className="text-center text-gray-500">
            <Settings size={48} className="mx-auto mb-4 opacity-50" />
            <p>Simplified settings panel coming soon</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg">
        <p className="font-medium mb-2">💡 Tips for better images:</p>
        <ul className="space-y-1">
          <li>• Use high-quality images (at least 1200px wide)</li>
          <li>• Keep file sizes under 5MB for faster loading</li>
          <li>• Use consistent lighting and style across images</li>
          {showImageSettings && <li>• Use the Auto-Optimize button for best results</li>}
        </ul>
      </div>
    </div>
  );
};

export default SimplifiedImageUpload;
