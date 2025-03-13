import { put } from '@vercel/blob';

export async function uploadImage(file: File): Promise<string> {
  try {
    // Debug log to check environment variables
    console.log('Environment variables:', {
      NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN:
        process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
      NODE_ENV: process.env.NODE_ENV,
    });

    if (!process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN) {
      console.error('Missing environment variable:', {
        NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN:
          process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
      });
      throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
    }

    const { url } = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
    });
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}
