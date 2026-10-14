/**
 * Memoir Image Service
 * Supports ALL image file extensions and formats (JPEG, PNG, WEBP, HEIC, HEIF,
 * AVIF, GIF, SVG, BMP, ICO, TIFF, JFIF, camera RAW/DNG, etc.).
 *
 * Uploads images to Supabase Storage and returns a permanent public CDN URL.
 */
import { supabase } from './supabase';

// Increased max image size to 25 MB to easily accommodate modern high-res mobile & camera photos
export const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
export const STORAGE_BUCKET = 'memoir-images';

export type UploadResult =
  | { url: string; error: null }
  | { url: null; error: string };

/**
 * Complete list of all supported image extensions
 */
export const SUPPORTED_IMAGE_EXTENSIONS = [
  'jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi', 'pjpeg', 'pjp',
  'png',
  'webp',
  'gif',
  'svg', 'svgz',
  'avif',
  'heic', 'heif', 'heics', 'heifs',
  'bmp', 'dib',
  'ico', 'cur',
  'tiff', 'tif',
  'raw', 'cr2', 'cr3', 'crw', 'nef', 'nrw', 'arw', 'srf', 'sr2', 'dng', 'orf', 'rw2', 'pef', 'ptx', 'raf',
  'psd', 'ai', 'eps', 'hdr', 'tga', 'icns', 'dds'
] as const;

/**
 * HTML <input type="file" accept="..."> value that explicitly shows all supported
 * image formats in Windows/macOS/iOS/Android file pickers without OS filtering issues.
 */
export const IMAGE_INPUT_ACCEPT = [
  'image/*',
  '.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp',
  '.png',
  '.webp',
  '.gif',
  '.svg',
  '.avif',
  '.heic', '.heif',
  '.bmp',
  '.ico',
  '.tiff', '.tif',
  '.raw', '.cr2', '.cr3', '.nef', '.arw', '.dng', '.orf', '.rw2', '.pef', '.raf',
  '.psd'
].join(',');

/**
 * Extract clean lowercase file extension from filename or path.
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length <= 1) return '';
  return parts.pop()?.toLowerCase().trim() ?? '';
}

/**
 * Determine MIME type from extension or file type.
 */
export function getMimeType(fileName: string, fallbackType?: string): string {
  if (fallbackType && fallbackType.startsWith('image/')) {
    return fallbackType;
  }
  const ext = getFileExtension(fileName);
  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'jfif':
    case 'pjpeg':
    case 'pjp':
    case 'jpe':
    case 'jif':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    case 'svg':
    case 'svgz':
      return 'image/svg+xml';
    case 'avif':
      return 'image/avif';
    case 'heic':
    case 'heics':
      return 'image/heic';
    case 'heif':
    case 'heifs':
      return 'image/heif';
    case 'bmp':
    case 'dib':
      return 'image/bmp';
    case 'ico':
    case 'cur':
      return 'image/x-icon';
    case 'tiff':
    case 'tif':
      return 'image/tiff';
    case 'dng':
      return 'image/x-adobe-dng';
    case 'cr2':
    case 'cr3':
    case 'crw':
      return 'image/x-canon-cr2';
    case 'nef':
    case 'nrw':
      return 'image/x-nikon-nef';
    case 'arw':
    case 'srf':
    case 'sr2':
      return 'image/x-sony-arw';
    case 'orf':
      return 'image/x-olympus-orf';
    case 'rw2':
      return 'image/x-panasonic-rw2';
    case 'raf':
      return 'image/x-fuji-raf';
    case 'psd':
      return 'image/vnd.adobe.photoshop';
    default:
      return fallbackType || (ext ? `image/${ext}` : 'image/jpeg');
  }
}

/**
 * Check if a file is an image by MIME type or extension.
 */
export function isImageFile(file: File): boolean {
  if (file.type && file.type.startsWith('image/')) {
    return true;
  }
  const ext = getFileExtension(file.name);
  if (!ext) return false;
  return (SUPPORTED_IMAGE_EXTENSIONS as readonly string[]).includes(ext);
}

/**
 * Convert HEIC/HEIF images to JPEG if possible so all web browsers (Chrome, Edge, Firefox)
 * can natively preview and render them without broken images.
 */
export async function processImageForDisplay(file: File): Promise<File> {
  const ext = getFileExtension(file.name);
  const isHeic = ext === 'heic' || ext === 'heif' || file.type === 'image/heic' || file.type === 'image/heif';

  if (!isHeic) {
    return file;
  }

  try {
    const heic2anyModule = await import('heic2any');
    const heic2any = heic2anyModule.default || heic2anyModule;
    const converted = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9,
    });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    const newName = file.name.replace(/\.(heic|heif|heics|heifs)$/i, '.jpg');
    return new File([blob], newName, { type: 'image/jpeg' });
  } catch (err) {
    console.warn('[Memoir] HEIC conversion fallback to original file:', err);
    return file;
  }
}

/**
 * Validate file before upload:
 * - Must be an image file (all extensions & MIME types supported)
 * - Must be ≤ 25 MB
 */
export function validateImageFile(file: File): string | null {
  if (!isImageFile(file)) {
    const ext = getFileExtension(file.name);
    return `File "${file.name}" ${ext ? `(.${ext}) ` : ''}is not a supported image file. All image formats (JPG, PNG, WEBP, HEIC, AVIF, GIF, SVG, BMP, TIFF, RAW, etc.) are supported.`;
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const maxMb = (MAX_IMAGE_SIZE_BYTES / (1024 * 1024)).toFixed(0);
    return `Image is ${sizeMb} MB. Maximum allowed size is ${maxMb} MB. Please select an image under ${maxMb} MB.`;
  }
  return null;
}

/**
 * Upload a File object to Supabase Storage.
 * Automatically resolves the correct MIME type for all image extensions.
 * Returns the permanent public URL or an error message.
 */
export async function uploadImageToSupabase(
  file: File,
  folderPath: string = 'posts'
): Promise<UploadResult> {
  // Client-side validation first
  const validationError = validateImageFile(file);
  if (validationError) {
    return { url: null, error: validationError };
  }

  // Pre-process HEIC/HEIF if needed
  const processedFile = await processImageForDisplay(file);

  // Build a unique, collision-free storage path
  const ext = getFileExtension(processedFile.name) || 'jpg';
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const storagePath = `${folderPath}/${fileName}`;
  const contentType = getMimeType(processedFile.name, processedFile.type);

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, processedFile, {
      cacheControl: '31536000', // 1-year CDN cache
      contentType,
      upsert: false,
    });

  if (uploadError) {
    console.error('[Memoir] Supabase upload error:', uploadError);
    return { url: null, error: uploadError.message };
  }

  // Get the permanent public URL
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  return { url: data.publicUrl, error: null };
}

/**
 * Upload multiple files and return an array of results.
 * Each file is processed and uploaded individually; failed uploads are reported per-file.
 */
export async function uploadMultipleImages(
  files: File[],
  folderPath: string = 'posts',
  onProgress?: (done: number, total: number) => void
): Promise<{ urls: string[]; errors: string[] }> {
  const urls: string[] = [];
  const errors: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = await uploadImageToSupabase(files[i], folderPath);
    if (result.url) {
      urls.push(result.url);
    } else {
      errors.push(`${files[i].name}: ${result.error}`);
    }
    onProgress?.(i + 1, files.length);
  }

  return { urls, errors };
}
