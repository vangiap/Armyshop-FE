const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8001') as string;

/**
 * Converts image path to full URL
 * @param path - Image path from API (can be relative or absolute)
 * @returns Full URL or null if path is invalid
 */
export const getImageUrl = (path: string | null): string | null => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${API_URL}${path}`;
  return path;
};

/**
 * Converts image path to full URL with fallback
 * @param path - Image path from API
 * @param fallback - Fallback URL if path is invalid
 * @returns Full URL
 */
export const getImageUrlWithFallback = (path: string | null, fallback: string = ''): string => {
  return getImageUrl(path) || fallback;
};
