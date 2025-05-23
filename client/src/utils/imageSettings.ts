import type { ImageSettings } from '../types/project';

// Default image settings for fallback
export const DEFAULT_IMAGE_SETTINGS: ImageSettings = {
  aspectRatio: '16:9',
  fitBehavior: 'cover',
  width: 400,
  height: 300,
  scale: 100,
  lockAspectRatio: true
};

// Convert image settings to CSS styles
export const getImageStyles = (
  settings: ImageSettings | undefined,
  fallbackSettings?: ImageSettings
): React.CSSProperties => {
  const imageSettings = settings || fallbackSettings || DEFAULT_IMAGE_SETTINGS;
  const { aspectRatio, customAspectRatio, fitBehavior, width, height, scale = 100 } = imageSettings;

  let styles: React.CSSProperties = {
    objectFit: fitBehavior as 'cover' | 'contain' | 'fill',
    transition: 'all 0.3s ease'
  };

  // Apply scale
  if (scale !== 100) {
    const scaleFactor = scale / 100;
    styles.transform = `scale(${scaleFactor})`;
  }

  return styles;
};

// Get container styles based on aspect ratio
export const getContainerStyles = (
  settings: ImageSettings | undefined,
  fallbackSettings?: ImageSettings
): React.CSSProperties => {
  const imageSettings = settings || fallbackSettings || DEFAULT_IMAGE_SETTINGS;
  const { aspectRatio, customAspectRatio, width, height } = imageSettings;

  let styles: React.CSSProperties = {};

  // Apply aspect ratio only if not 'original'
  if (aspectRatio && aspectRatio !== 'original') {
    if (aspectRatio === 'custom' && customAspectRatio) {
      const [w, h] = customAspectRatio.split(':').map(Number);
      if (w && h) {
        styles.aspectRatio = `${w} / ${h}`;
      }
    } else if (aspectRatio !== 'custom') {
      const [w, h] = aspectRatio.split(':').map(Number);
      if (w && h) {
        styles.aspectRatio = `${w} / ${h}`;
      }
    }
  }

  // For 'original' aspect ratio, only apply dimensions if both are provided
  if (aspectRatio === 'original') {
    if (width && height) {
      styles.width = `${width}px`;
      styles.height = `${height}px`;
    }
  }

  return styles;
};

// Get CSS classes for aspect ratio (for Tailwind compatibility)
export const getAspectRatioClasses = (
  settings: ImageSettings | undefined,
  fallbackSettings?: ImageSettings
): string => {
  const imageSettings = settings || fallbackSettings || DEFAULT_IMAGE_SETTINGS;
  const { aspectRatio, customAspectRatio } = imageSettings;

  if (!aspectRatio || aspectRatio === 'original') {
    return '';
  }

  // Map common aspect ratios to Tailwind classes
  const aspectRatioMap: Record<string, string> = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '3:4': 'aspect-[3/4]'
  };

  if (aspectRatio === 'custom' && customAspectRatio) {
    const [w, h] = customAspectRatio.split(':').map(Number);
    if (w && h) {
      return `aspect-[${w}/${h}]`;
    }
  }

  return aspectRatioMap[aspectRatio] || '';
};

// Get object-fit classes for Tailwind
export const getObjectFitClasses = (
  settings: ImageSettings | undefined,
  fallbackSettings?: ImageSettings
): string => {
  const imageSettings = settings || fallbackSettings || DEFAULT_IMAGE_SETTINGS;
  const { fitBehavior } = imageSettings;

  const fitMap: Record<string, string> = {
    'cover': 'object-cover',
    'contain': 'object-contain',
    'fill': 'object-fill'
  };

  // Default to 'cover' to prevent white space issues
  return fitMap[fitBehavior] || 'object-cover';
};

// Apply responsive styles based on breakpoints
export const getResponsiveImageStyles = (
  settings: ImageSettings | undefined,
  breakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop',
  fallbackSettings?: ImageSettings
): React.CSSProperties => {
  const imageSettings = settings || fallbackSettings || DEFAULT_IMAGE_SETTINGS;
  const baseStyles = getImageStyles(imageSettings);

  // Adjust scale based on breakpoint
  const breakpointScales = {
    mobile: 0.8,
    tablet: 0.9,
    desktop: 1.0
  };

  const scale = (imageSettings.scale || 100) / 100;
  const responsiveScale = scale * breakpointScales[breakpoint];

  return {
    ...baseStyles,
    transform: `scale(${responsiveScale})`
  };
};

// Utility to merge image settings with defaults and fix problematic settings
export const mergeImageSettings = (
  projectSettings: ImageSettings | undefined,
  globalSettings: ImageSettings | undefined
): ImageSettings => {
  const merged = {
    ...DEFAULT_IMAGE_SETTINGS,
    ...globalSettings,
    ...projectSettings
  };

  // Fix problematic settings that could cause white space
  // If fitBehavior is 'contain' and we're in a fixed container, use 'cover' instead
  if (merged.fitBehavior === 'contain' && merged.aspectRatio !== 'original') {
    merged.fitBehavior = 'cover';
  }

  return merged;
};

// Utility to detect if image settings might cause white space
export const hasWhiteSpaceRisk = (settings: ImageSettings): boolean => {
  // 'contain' fit behavior can cause white space in fixed aspect ratio containers
  if (settings.fitBehavior === 'contain' && settings.aspectRatio !== 'original') {
    return true;
  }

  // Very small scale values can cause white space
  if (settings.scale && settings.scale < 50) {
    return true;
  }

  return false;
};

// Utility to fix white space issues in image settings
export const fixWhiteSpaceIssues = (settings: ImageSettings): ImageSettings => {
  const fixed = { ...settings };

  // Fix 'contain' in fixed aspect ratio containers
  if (fixed.fitBehavior === 'contain' && fixed.aspectRatio !== 'original') {
    fixed.fitBehavior = 'cover';
  }

  // Fix very small scale values
  if (fixed.scale && fixed.scale < 50) {
    fixed.scale = 100;
  }

  return fixed;
};
