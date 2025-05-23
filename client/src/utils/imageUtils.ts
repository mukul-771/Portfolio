// Utility functions for handling image URLs in production

const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:5001' 
  : (import.meta.env.VITE_API_URL || 'https://mukul-portfolio-api.onrender.com');

/**
 * Convert relative image URLs to absolute URLs for production
 * @param imageUrl - The image URL (can be relative or absolute)
 * @returns Absolute image URL
 */
export const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  
  // If it's already an absolute URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative URL starting with /, prepend the API base URL
  if (imageUrl.startsWith('/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }
  
  // If it's a relative URL without /, prepend the API base URL with /
  return `${API_BASE_URL}/${imageUrl}`;
};

/**
 * Get optimized image URL with query parameters for better loading
 * @param imageUrl - The base image URL
 * @param options - Optimization options
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (
  imageUrl: string, 
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
): string => {
  const baseUrl = getImageUrl(imageUrl);
  
  if (!options) return baseUrl;
  
  const params = new URLSearchParams();
  if (options.width) params.append('w', options.width.toString());
  if (options.height) params.append('h', options.height.toString());
  if (options.quality) params.append('q', options.quality.toString());
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Check if an image URL is valid and accessible
 * @param imageUrl - The image URL to check
 * @returns Promise that resolves to true if image is accessible
 */
export const isImageAccessible = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(getImageUrl(imageUrl), { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get a fallback image URL if the original is not accessible
 * @param imageUrl - The original image URL
 * @param fallbackUrl - The fallback image URL
 * @returns Promise that resolves to the accessible image URL
 */
export const getAccessibleImageUrl = async (
  imageUrl: string, 
  fallbackUrl: string = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
): Promise<string> => {
  const isAccessible = await isImageAccessible(imageUrl);
  return isAccessible ? getImageUrl(imageUrl) : fallbackUrl;
};
