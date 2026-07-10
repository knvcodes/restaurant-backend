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

// auth middleware

export type TokenPayload = {
  id: string;
  name: string;
  role: string;
};

export interface CustomRequest extends Request {
  user: {
    id: string;
  };
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        // add other user properties as needed
      };
    }
  }
}

// Interface
export interface Users extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
  isOAuth: boolean;
  googleId?: string;
}
