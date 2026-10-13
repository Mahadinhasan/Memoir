/**
 * Memoir Image Service
 * Uploads images to Supabase Storage and returns a public URL.
 * Max image size enforced: 3 MB
 */
import { supabase } from './supabase';

export const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB
export const STORAGE_BUCKET = 'memoir-images';

export type UploadResult =
  | { url: string; error: null }
  | { url: null; error: string };

/**
 * Validate file before upload:
 * - Must be an image MIME type
 * - Must be ≤ 3 MB
 */
export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Only image files (JPEG, PNG, WEBP, HEIC) are supported.';
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return `Image is ${sizeMb} MB. Maximum allowed size is 3 MB. Please compress or resize the image.`;
  }
  return null;
}

/**
 * Upload a File object to Supabase Storage.
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

  // Build a unique, collision-free storage path
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const storagePath = `${folderPath}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '31536000', // 1-year CDN cache
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
 * Each file is uploaded individually; failed uploads are reported per-file.
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
