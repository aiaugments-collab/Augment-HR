import { v2 as cloudinary } from 'cloudinary';
import { TRPCError } from "@trpc/server";
import { env } from "@/env";

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export type CloudinaryUploadResult = {
  public_id: string;
  version: number;
  signature: string;
  width?: number;
  height?: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder?: string;
  original_filename: string;
};

export class CloudinaryService {
  /**
   * Generate a signed upload URL for direct client-side uploads
   */
  static async generateSignedUploadUrl({
    folder = 'resumes',
    resourceType = 'raw',
    allowedFormats = ['pdf', 'doc', 'docx'],
  }: {
    folder?: string;
    resourceType?: 'image' | 'raw' | 'video' | 'auto';
    allowedFormats?: string[];
  }) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      
      const uploadParams = {
        timestamp,
        folder,
      };

      // Generate signature for secure uploads
      const signature = cloudinary.utils.api_sign_request(
        uploadParams,
        env.CLOUDINARY_API_SECRET
      );

      return {
        timestamp,
        signature,
        api_key: env.CLOUDINARY_API_KEY,
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        folder,
        resource_type: resourceType,
        allowed_formats: allowedFormats,
        upload_url: `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/raw/upload`,
      };
    } catch (error) {
      console.error('Error generating Cloudinary signed URL:', error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate signed upload URL",
      });
    }
  }

  /**
   * Upload file directly from server (for server-side uploads)
   */
  static async uploadFile({
    file,
    folder = 'resumes',
    resourceType = 'auto',
  }: {
    file: Buffer;
    folder?: string;
    resourceType?: 'image' | 'raw' | 'video' | 'auto';
  }): Promise<CloudinaryUploadResult> {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: resourceType,
          },
          (error, result) => {
            if (error) {
              if (error instanceof Error) {
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                reject(error);
              } else {
                reject(new Error('Upload failed'));
              }
            } else if (result) {
              resolve(result as CloudinaryUploadResult);
            } else {
              reject(new Error('Upload failed - no result'));
            }
          }
        ).end(file);
      });
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to upload file to Cloudinary",
      });
    }
  }

  /**
   * Delete a file from Cloudinary
   */
  static async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete file from Cloudinary",
      });
    }
  }

  /**
   * Get optimized URL for a file
   */
  static getOptimizedUrl(publicId: string, options?: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  }): string {
    return cloudinary.url(publicId, {
      secure: true,
      ...options,
    });
  }

  /**
   * Generate a public URL from a Cloudinary public_id
   */
  static getPublicUrl(publicId: string): string {
    return cloudinary.url(publicId, { secure: true });
  }
}