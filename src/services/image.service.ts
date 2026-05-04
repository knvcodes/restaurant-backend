import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import StorageService from "./storage.service";
import { ImageUploadResult, MulterFile } from "../utils/types";

export class ImageService {
  private storage: StorageService;
  private readonly ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  private readonly MAX_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly THUMBNAIL_SIZE = 300;

  constructor(storage: StorageService) {
    this.storage = storage;
  }

  // ============================================
  // VALIDATION
  // ============================================

  validateImage(file: MulterFile): void {
    if (!this.ALLOWED_TYPES.includes(file.mimetype)) {
      throw new Error(
        `Invalid file type. Allowed: ${this.ALLOWED_TYPES.join(", ")}`,
      );
    }

    if (file.size > this.MAX_SIZE) {
      throw new Error(
        `File too large. Max size: ${this.MAX_SIZE / 1024 / 1024}MB`,
      );
    }
  }

  // ============================================
  // UPLOAD WITH PROCESSING
  // ============================================

  async uploadImage(
    file: MulterFile,
    options: {
      folder?: string;
      resize?: {
        width?: number;
        height?: number;
        fit?: "cover" | "contain" | "fill";
      };
      quality?: number;
      generateThumbnail?: boolean;
      metadata?: Record<string, string>;
    } = {},
  ): Promise<ImageUploadResult> {
    // Validate
    this.validateImage(file);

    const folder = options.folder || "images";
    const ext = this.getExtension(file.mimetype);
    const id = uuidv4();
    const key = `${folder}/${id}.${ext}`;

    // Process image with sharp
    let processedBuffer = await sharp(file.buffer)
      .resize({
        width: options.resize?.width,
        height: options.resize?.height,
        fit: options.resize?.fit || "cover",
        withoutEnlargement: true,
      })
      .toFormat(ext as any, { quality: options.quality || 80 })
      .toBuffer();

    // Get image info
    const metadata = await sharp(processedBuffer).metadata();

    // Upload original/processed image
    const result = await this.storage.uploadBuffer(key, processedBuffer, {
      contentType: `image/${ext}`,
      metadata: {
        "original-name": file.originalname,
        "uploaded-at": new Date().toISOString(),
        ...options.metadata,
      },
    });

    let thumbnailResult: ImageUploadResult | undefined;

    // Generate thumbnail if requested
    if (options.generateThumbnail) {
      const thumbnailKey = `${folder}/${id}-thumb.${ext}`;
      const thumbnailBuffer = await sharp(file.buffer)
        .resize(this.THUMBNAIL_SIZE, this.THUMBNAIL_SIZE, { fit: "cover" })
        .toFormat(ext as any, { quality: 70 })
        .toBuffer();

      thumbnailResult = await this.storage.uploadBuffer(
        thumbnailKey,
        thumbnailBuffer,
        {
          contentType: `image/${ext}`,
          metadata: { type: "thumbnail", parent: key },
        },
      );
    }

    return {
      ...result,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: processedBuffer.length,
      thumbnailKey: thumbnailResult?.key,
      thumbnailUrl: thumbnailResult?.publicUrl,
    };
  }

  // ============================================
  // MULTIPLE IMAGES
  // ============================================

  async uploadMultipleImages(
    files: MulterFile[],
    options: Parameters<ImageService["uploadImage"]>[1] = {},
  ): Promise<ImageUploadResult[]> {
    return await Promise.all(
      files.map((file) => this.uploadImage(file, options)),
    );
  }

  // ============================================
  // RESTAURANT-SPECIFIC HELPERS
  // ============================================

  async uploadRestaurantLogo(
    file: MulterFile,
    restaurantId: string,
  ): Promise<ImageUploadResult> {
    return this.uploadImage(file, {
      folder: `restaurants/${restaurantId}/logo`,
      resize: { width: 400, height: 400, fit: "contain" },
      quality: 90,
      generateThumbnail: true,
      metadata: { restaurantId, type: "logo" },
    });
  }

  async uploadRestaurantBanner(
    file: MulterFile,
    restaurantId: string,
  ): Promise<ImageUploadResult> {
    return this.uploadImage(file, {
      folder: `restaurants/${restaurantId}/banner`,
      resize: { width: 1200, height: 400, fit: "cover" },
      quality: 85,
      metadata: { restaurantId, type: "banner" },
    });
  }

  async uploadMenuItemImage(
    file: MulterFile,
    restaurantId: string,
    itemId: string,
  ): Promise<ImageUploadResult> {
    return this.uploadImage(file, {
      folder: `restaurants/${restaurantId}/menu/${itemId}`,
      resize: { width: 600, height: 600, fit: "cover" },
      quality: 85,
      generateThumbnail: true,
      metadata: { restaurantId, itemId, type: "menu-item" },
    });
  }

  async uploadUserAvatar(
    file: MulterFile,
    userId: string,
  ): Promise<ImageUploadResult> {
    return this.uploadImage(file, {
      folder: `users/${userId}/avatar`,
      resize: { width: 200, height: 200, fit: "cover" },
      quality: 90,
      generateThumbnail: false,
      metadata: { userId, type: "avatar" },
    });
  }

  // ============================================
  // DELETE HELPERS
  // ============================================

  async deleteImage(key: string): Promise<void> {
    await this.storage.deleteObject(key);
  }

  async deleteImages(keys: string[]): Promise<void> {
    await this.storage.deleteObjects(keys);
  }

  // ============================================
  // PRIVATE HELPERS
  // ============================================

  private getExtension(mimetype: string): string {
    const map: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };
    return map[mimetype] || "jpg";
  }
}

export default ImageService;
