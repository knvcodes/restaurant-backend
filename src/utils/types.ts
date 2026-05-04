import { Request } from "express";

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  cacheControl?: string;
}

export interface UploadResult {
  key: string;
  bucket: string;
  url: string;
  publicUrl: string;
}

export interface ImageUploadResult extends UploadResult {
  width?: number;
  height?: number;
  format?: string;
  size: number;
  thumbnailKey?: string;
  thumbnailUrl?: string;
}

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}
