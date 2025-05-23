// Project type definitions

// Image display settings interface
export interface ImageSettings {
  aspectRatio: string; // '16:9', '4:3', '1:1', '3:4', 'original', 'custom'
  customAspectRatio?: string; // For custom ratios like '5:4', '21:9'
  fitBehavior: 'cover' | 'contain' | 'fill'; // How image fits in container
  width?: number; // Custom width in pixels
  height?: number; // Custom height in pixels
  scale?: number; // Scale percentage (25, 50, 75, 100, 125, 150)
  lockAspectRatio?: boolean; // Whether to maintain aspect ratio during manual resize
}

// Global image settings interface
export interface GlobalImageSettings {
  defaultThumbnailSettings: ImageSettings;
  defaultHeroSettings: ImageSettings;
  defaultGallerySettings: ImageSettings;
  responsiveBreakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

// Base project interface
export interface Project {
  id: string | number; // Support both string (Firebase) and number (MongoDB) IDs
  title: string;
  description: string;
  imageUrl: string;
  category: 'developer' | 'designer';
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  projectType?: ProjectType;
  images?: string[];
  featured?: boolean;
  detailedDescription?: string;
  technicalDetails?: string;
  implementationInfo?: string;
  createdAt?: Date;
  // New fields for enhanced project details
  mockupImageUrl?: string; // For developer projects - main working website image
  overviewDescription?: string; // For developer projects - project overview
  galleryImages?: string[]; // For multiple screenshots/photos
  // Image settings for different display contexts
  thumbnailImageSettings?: ImageSettings; // Settings for project card thumbnails
  heroImageSettings?: ImageSettings; // Settings for project detail hero images
  galleryImageSettings?: ImageSettings; // Settings for gallery images
  mockupImageSettings?: ImageSettings; // Settings for mockup images
}

// Project types
export type ProjectType = 'web' | 'mobile' | 'desktop' | 'photography' | 'production' | 'poster' | 'magazine' | 'other';

// Developer project specific fields
export interface DeveloperProject extends Project {
  category: 'developer';
  projectType: 'web' | 'mobile' | 'desktop' | 'other';
  technicalDetails: string;
  implementationInfo: string;
  codeSnippets?: CodeSnippet[];
  challenges?: string[];
  solutions?: string[];
  // Enhanced developer-specific fields
  mockupImageUrl: string; // Main working website image
  overviewDescription: string; // Project overview section
  galleryImages: string[]; // Multiple website screenshots
}

// Designer project specific fields
export interface DesignerProject extends Project {
  category: 'designer';
  projectType: 'photography' | 'production' | 'poster' | 'magazine' | 'other';
  // Enhanced designer-specific fields
  galleryImages: string[]; // Multiple photos for bento box/grid layout
}

// Photography project
export interface PhotographyProject extends DesignerProject {
  projectType: 'photography';
  photoCollection: string[]; // Array of image URLs
  photoDetails?: string;
}

// Production project
export interface ProductionProject extends DesignerProject {
  projectType: 'production';
  videoUrl?: string;
  thumbnailUrl?: string;
  productionDetails?: string;
}

// Poster project
export interface PosterProject extends DesignerProject {
  projectType: 'poster';
  highResImageUrl: string;
  posterDetails?: string;
}

// Magazine project
export interface MagazineProject extends DesignerProject {
  projectType: 'magazine';
  magazinePreviewImages: string[];
  magazineDetails?: string;
  fullContentUrl?: string;
}

// Code snippet for developer projects
export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  description?: string;
}
