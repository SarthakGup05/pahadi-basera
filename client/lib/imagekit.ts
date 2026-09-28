import api from '@/lib/api';

export const IMAGEKIT_ENDPOINT = (
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/skhds42rl/'
).replace(/\/+$/, '') + '/';

export interface ImageKitUploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  filePath: string;
  height: number;
  width: number;
  size: number;
  fileType: string;
}

export interface ImageKitTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  cropMode?: 'pad_resize' | 'force' | 'at_least' | 'at_max' | 'maintain_ratio';
  focus?: 'auto' | 'face' | 'center' | 'top' | 'bottom';
  blur?: number;
  radius?: number | 'max';
}

/**
 * Appends ImageKit transformation query parameters to a given image URL or relative path.
 * Example output: https://ik.imagekit.io/skhds42rl/properties/villa.jpg?tr=w-800,h-600,fo-auto,q-80,f-auto
 */
export function getImageKitUrl(
  source: string,
  options: ImageKitTransformOptions = {}
): string {
  if (!source) return '';

  // Resolve absolute ImageKit URL if relative path provided
  const fullUrl = source.startsWith('http')
    ? source
    : `${IMAGEKIT_ENDPOINT}${source.replace(/^\/+/, '')}`;

  // If the image is not hosted on ImageKit, return unmodified URL
  if (!fullUrl.includes('ik.imagekit.io')) {
    return fullUrl;
  }

  const transformations: string[] = [];

  if (options.width) transformations.push(`w-${options.width}`);
  if (options.height) transformations.push(`h-${options.height}`);
  if (options.quality) transformations.push(`q-${options.quality}`);
  if (options.cropMode) transformations.push(`cm-${options.cropMode}`);
  if (options.focus) transformations.push(`fo-${options.focus}`);
  if (options.blur) transformations.push(`bl-${options.blur}`);
  if (options.radius) transformations.push(`r-${options.radius}`);

  // Default to automatic format conversion (WebP / AVIF)
  transformations.push(`f-${options.format || 'auto'}`);

  const transformParam = `tr=${transformations.join(',')}`;
  const separator = fullUrl.includes('?') ? '&' : '?';

  return `${fullUrl}${separator}${transformParam}`;
}

export interface DirectUploadOptions {
  folder?: 'properties' | 'packages' | 'blogs' | 'avatars' | 'kyc' | string;
  tags?: string[];
  customFileName?: string;
  onProgress?: (percent: number) => void;
}

/**
 * Uploads a file directly from the browser to ImageKit storage using backend HMAC auth parameters.
 * Bypasses Render backend memory and bandwidth completely.
 */
export async function uploadToImageKit(
  file: File,
  options: DirectUploadOptions = {}
): Promise<ImageKitUploadResponse> {
  // 1. Request signed authentication parameters from Express backend
  const { data: auth } = await api.get<{
    token: string;
    expire: number;
    signature: string;
  }>('/api/media/imagekit-auth');

  if (!auth?.token || !auth?.signature || !auth?.expire) {
    throw new Error('Failed to retrieve valid ImageKit authentication signature from server');
  }

  const publicKey =
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
    'public_G7QoK...'; // Fallback if set in env

  const targetFolder = options.folder ? `/pahadi-basera/${options.folder.replace(/^\/+/, '')}` : '/pahadi-basera/general';
  const cleanName = options.customFileName || `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

  // 2. Prepare FormData payload according to ImageKit Upload API specification
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', cleanName);
  formData.append('publicKey', publicKey);
  formData.append('signature', auth.signature);
  formData.append('expire', auth.expire.toString());
  formData.append('token', auth.token);
  formData.append('folder', targetFolder);
  formData.append('useUniqueFileName', 'true');

  if (options.tags && options.tags.length > 0) {
    formData.append('tags', options.tags.join(','));
  }

  // 3. Direct POST request to ImageKit Upload API
  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = errJson.message || errJson.help || JSON.stringify(errJson);
    } catch {
      errorDetail = await response.text();
    }
    throw new Error(`ImageKit upload failed (${response.status}): ${errorDetail}`);
  }

  return response.json();
}
