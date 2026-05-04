# MinIO Local Setup Guide (TypeScript)

A complete TypeScript guide for setting up MinIO locally for object storage with Node.js integration.

---

## Table of Contents

1. [What is MinIO?](#what-is-minio)
2. [Local MinIO Setup](#local-minio-setup)
   - [Option A: Docker (Recommended)](#option-a-docker-recommended)
   - [Option B: Binary Installation](#option-b-binary-installation)
   - [Option C: Docker Compose](#option-c-docker-compose)
3. [Web Console Setup](#web-console-setup)
4. [Node.js Integration (TypeScript)](#nodejs-integration-typescript)
   - [Install Dependencies](#install-dependencies)
   - [Core Client Setup](#core-client-setup)
   - [Complete Storage Service](#complete-storage-service)
   - [Express Integration](#express-integration)
   - [Environment-Based Config](#environment-based-config)
5. [Testing Your Setup](#testing-your-setup)
6. [Common Issues & Troubleshooting](#common-issues--troubleshooting)
7. [Important Concepts](#important-concepts)

---

## What is MinIO?

MinIO is a high-performance, S3-compatible object storage server. It implements the same API as Amazon S3, meaning any code or tool that works with S3 will work with MinIO with minimal changes.

---

## Local MinIO Setup

> **⚠️ EXECUTE SEPARATELY:** This section is infrastructure setup — run these commands in your terminal **before** starting your backend application.

### Option A: Docker (Recommended for Local Dev)

```bash
# Pull and run MinIO
docker run -p 9000:9000 -p 9001:9001 \
  --name minio \
  -v ~/minio-data:/data \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_ROOT_PASSWORD=password123" \
  quay.io/minio/minio server /data --console-address ":9001"
```

**What each flag does:**

| Flag | Purpose |
|------|---------|
| `-p 9000:9000` | API port (where your app connects) |
| `-p 9001:9001` | Web Console port (browser UI) |
| `-v ~/minio-data:/data` | Persistent volume mount |
| `-e MINIO_ROOT_USER/PASSWORD` | Admin credentials |
| `--console-address ":9001"` | Enables the web UI |

**Access points after running:**

- **API Endpoint:** `http://localhost:9000`
- **Web Console:** `http://localhost:9001` (login with admin/password123)

---

### Option B: Binary Installation (No Docker)

> **⚠️ EXECUTE SEPARATELY:** Run these in your terminal, not in your Node.js app.

**macOS:**
```bash
brew install minio/stable/minio
```

**Linux:**
```bash
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/
```

**Run it:**
```bash
mkdir -p ~/minio-data
minio server ~/minio-data --console-address ":9001"
```

---

### Option C: Docker Compose (Full Stack)

> **⚠️ EXECUTE SEPARATELY:** This is infrastructure — keep it separate from your backend code.

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  minio:
    image: quay.io/minio/minio
    container_name: minio
    ports:
      - "9000:9000"   # S3 API
      - "9001:9001"   # Web Console
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: password123
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

volumes:
  minio_data:
```

Run:
```bash
docker-compose up -d
```

---

## Web Console Setup

> **⚠️ EXECUTE SEPARATELY:** Manual step — use your browser, not code.

1. Open `http://localhost:9001`
2. Login with your credentials
3. Create a bucket:
   - Click **Buckets** → **Create Bucket**
   - Name it (e.g., `my-app-bucket`)
   - **Important:** For local dev, you can disable versioning if you want simplicity

---

## Node.js Integration (TypeScript)

> **✅ BACKEND CODE:** Everything from here onward is your application code.

### Install Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
npm install -D @types/node typescript ts-node
```

> **Why AWS SDK and not `minio` npm package?**
> - The official `minio` package works fine but the AWS SDK is more mature, better typed, and makes migrating to real S3 trivial — just remove the `endpoint`.

---

### Core Client Setup

**File:** `src/config/s3.ts`

```typescript
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'us-east-1',           // MinIO ignores this, but required
  endpoint: 'http://localhost:9000',
  credentials: {
    accessKeyId: 'admin',
    secretAccessKey: 'password123'
  },
  forcePathStyle: true,          // CRITICAL: MinIO uses path-style URLs
  // Optional: increase timeouts for large files
  requestHandler: {
    requestTimeout: 300000       // 5 minutes
  }
});

const BUCKET_NAME = 'my-bucket';

export { s3Client, BUCKET_NAME };
```

**Why `forcePathStyle: true`?**

| Style | URL Format | Used By |
|-------|-----------|---------|
| Virtual-hosted (default) | `https://bucket-name.s3.region.amazonaws.com/object-key` | AWS S3 |
| Path-style | `https://minio-server/bucket-name/object-key` | **MinIO** |

Without `forcePathStyle: true`, the SDK tries virtual-hosted style and fails.

---

### Complete Storage Service

**File:** `src/services/storage.ts`

```typescript
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadBucketCommand,
  CreateBucketCommand,
  CopyObjectCommand,
  DeleteObjectsCommand,
  _Object,
  DeleteObjectsOutput
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { Response } from 'express';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  cacheControl?: string;
}

export interface UploadResult {
  key: string;
  bucket: string;
  url?: string;
}

export interface DownloadOptions {
  contentType?: string;
  filename?: string;
}

export interface StorageObject {
  key: string;
  size: number;
  lastModified: Date;
  url: string;
}

export interface DeleteBatchResult {
  deleted: string[];
  errors: string[];
}

// ============================================
// STORAGE SERVICE CLASS
// ============================================

export class StorageService {
  private client: S3Client;
  private bucket: string;

  constructor(s3Client: S3Client, bucketName: string) {
    this.client = s3Client;
    this.bucket = bucketName;
  }

  // ============================================
  // BUCKET MANAGEMENT
  // ============================================

  /**
   * Checks if the bucket exists and creates it if not.
   * Call this on application startup.
   */
  async ensureBucketExists(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      console.log(`✓ Bucket '${this.bucket}' exists`);
    } catch (err: any) {
      if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
        await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
        console.log(`✓ Bucket '${this.bucket}' created`);
      } else {
        throw err;
      }
    }
  }

  // ============================================
  // UPLOAD METHODS
  // ============================================

  /**
   * Upload a file from disk. Best for small to medium files.
   * @param key - Object key (path in bucket)
   * @param filePath - Local file path
   * @param options - Upload options
   * @returns Upload result with key, bucket, and public URL
   */
  async uploadFile(key: string, filePath: string, options: UploadOptions = {}): Promise<UploadResult> {
    const fileStream = fs.createReadStream(filePath);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: fileStream,
      ContentType: options.contentType || 'application/octet-stream',
      Metadata: options.metadata || {},
      CacheControl: options.cacheControl || 'no-cache'
    });

    await this.client.send(command);

    return {
      key,
      bucket: this.bucket,
      url: this.getPublicUrl(key)
    };
  }

  /**
   * Upload from a Buffer. Ideal for multer memoryStorage uploads.
   * @param key - Object key
   * @param buffer - File data in memory
   * @param options - Upload options
   * @returns Upload result
   */
  async uploadBuffer(key: string, buffer: Buffer, options: UploadOptions = {}): Promise<UploadResult> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: options.contentType || 'application/octet-stream',
      Metadata: options.metadata || {}
    });

    await this.client.send(command);
    return { key, bucket: this.bucket };
  }

  /**
   * Upload from a readable stream. Efficient for large files — no memory bloat.
   * @param key - Object key
   * @param stream - Data stream
   * @param options - Upload options
   * @returns Upload result
   */
  async uploadStream(key: string, stream: Readable, options: UploadOptions = {}): Promise<UploadResult> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: stream,
      ContentType: options.contentType || 'application/octet-stream'
    });

    await this.client.send(command);
    return { key, bucket: this.bucket };
  }

  /**
   * Multipart upload for large files (> 100MB recommended).
   * Auto-handles chunking, supports progress tracking, and is resumable.
   * @param key - Object key
   * @param filePath - Local file path
   * @param options - Upload options
   * @returns Upload result
   */
  async uploadLargeFile(key: string, filePath: string, options: UploadOptions = {}): Promise<UploadResult> {
    const fileStream = fs.createReadStream(filePath);

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: fileStream,
        ContentType: options.contentType || 'application/octet-stream'
      },
      queueSize: 4,               // Concurrent upload parts
      partSize: 5 * 1024 * 1024   // 5MB chunks
    });

    // Optional: progress tracking
    upload.on('httpUploadProgress', (progress: { loaded: number; total: number }) => {
      const percent = ((progress.loaded / progress.total) * 100).toFixed(2);
      console.log(`Upload progress: ${percent}%`);
    });

    await upload.done();
    return { key, bucket: this.bucket };
  }

  // ============================================
  // DOWNLOAD METHODS
  // ============================================

  /**
   * Download an object to disk.
   * @param key - Object key
   * @param outputPath - Where to save locally
   * @returns Promise resolving to output path
   */
  async downloadFile(key: string, outputPath: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key
    });

    const response = await this.client.send(command);
    const writeStream = fs.createWriteStream(outputPath);

    return new Promise((resolve, reject) => {
      (response.Body as Readable).pipe(writeStream);
      writeStream.on('finish', () => resolve(outputPath));
      writeStream.on('error', reject);
      (response.Body as Readable).on('error', reject);
    });
  }

  /**
   * Download as Buffer. Useful for in-memory processing.
   * @param key - Object key
   * @returns Promise resolving to Buffer
   */
  async downloadBuffer(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key
    });

    const response = await this.client.send(command);
    const chunks: Buffer[] = [];

    for await (const chunk of response.Body as Readable) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  /**
   * Stream directly to an HTTP response. Use this to serve files via Express.
   * @param key - Object key
   * @param res - Express response object
   * @param options - Download options
   */
  async streamToResponse(key: string, res: Response, options: DownloadOptions = {}): Promise<void> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key
    });

    const response = await this.client.send(command);

    // Set headers
    res.setHeader('Content-Type', options.contentType || response.ContentType || 'application/octet-stream');
    if (options.filename) {
      res.setHeader('Content-Disposition', `attachment; filename="${options.filename}"`);
    }
    if (response.ContentLength) {
      res.setHeader('Content-Length', response.ContentLength);
    }

    (response.Body as Readable).pipe(res);
  }

  // ============================================
  // URL GENERATION
  // ============================================

  /**
   * Generate a temporary signed URL for private objects.
   * @param key - Object key
   * @param expiresIn - Seconds until expiry (default: 3600)
   * @param operation - 'get' or 'put'
   * @returns Promise resolving to signed URL string
   */
  async getSignedUrl(key: string, expiresIn: number = 3600, operation: 'get' | 'put' = 'get'): Promise<string> {
    const CommandClass = operation === 'put' ? PutObjectCommand : GetObjectCommand;

    const command = new CommandClass({
      Bucket: this.bucket,
      Key: key
    });

    return await getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Get direct public URL. Only works if bucket/object is public.
   * @param key - Object key
   * @returns Public URL string
   */
  getPublicUrl(key: string): string {
    // Path-style: http://localhost:9000/bucket-name/key
    const endpoint = (this.client.config as any).endpoint;
    return `${endpoint}/${this.bucket}/${key}`;
  }

  // ============================================
  // LISTING & METADATA
  // ============================================

  /**
   * List objects with optional prefix filter.
   * @param prefix - Filter by path prefix (simulates folders)
   * @param maxKeys - Max results per call
   * @returns Array of object metadata
   */
  async listObjects(prefix: string = '', maxKeys: number = 1000): Promise<_Object[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
      MaxKeys: maxKeys
    });

    const response = await this.client.send(command);
    return response.Contents || [];
  }

  /**
   * Generator function for paginated listing. Handles large buckets efficiently.
   * @param prefix - Filter by path prefix
   * @param pageSize - Items per page
   * @yields Object metadata
   */
  async *listObjectsPaginated(prefix: string = '', pageSize: number = 100): AsyncGenerator<_Object> {
    let continuationToken: string | undefined = undefined;

    do {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        MaxKeys: pageSize,
        ContinuationToken: continuationToken
      });

      const response = await this.client.send(command);

      for (const obj of response.Contents || []) {
        yield obj;
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);
  }

  // ============================================
  // DELETE & MANAGE
  // ============================================

  /**
   * Delete a single object.
   * @param key - Object key
   * @returns Delete confirmation
   */
  async deleteObject(key: string): Promise<{ deleted: string }> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key
    });

    await this.client.send(command);
    return { deleted: key };
  }

  /**
   * Batch delete multiple objects.
   * @param keys - Array of object keys
   * @returns Delete batch result
   */
  async deleteObjects(keys: string[]): Promise<DeleteBatchResult> {
    const command = new DeleteObjectsCommand({
      Bucket: this.bucket,
      Delete: {
        Objects: keys.map(key => ({ Key: key }))
      }
    });

    const response: DeleteObjectsOutput = await this.client.send(command);
    return {
      deleted: response.Deleted?.map(d => d.Key!).filter(Boolean) || [],
      errors: response.Errors?.map(e => e.Key!).filter(Boolean) || []
    };
  }

  /**
   * Copy an object within the same bucket.
   * @param sourceKey - Source object key
   * @param destKey - Destination object key
   * @returns Copy confirmation
   */
  async copyObject(sourceKey: string, destKey: string): Promise<{ copied: string }> {
    const command = new CopyObjectCommand({
      Bucket: this.bucket,
      CopySource: `/${this.bucket}/${sourceKey}`,
      Key: destKey
    });

    await this.client.send(command);
    return { copied: destKey };
  }
}

export default StorageService;
```

---

### Express Integration

**File:** `src/app.ts`

```typescript
import express, { Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import path from 'path';
import { s3Client, BUCKET_NAME } from './config/s3';
import { StorageService, StorageObject } from './services/storage';

const app = express();
const storage = new StorageService(s3Client, BUCKET_NAME);
```

#### Multer Configuration

```typescript
const upload = multer({
  storage: multer.memoryStorage(),  // Store in memory, stream to MinIO
  limits: {
    fileSize: 500 * 1024 * 1024   // 500MB max
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
```

#### Initialize Bucket on Startup

```typescript
(async () => {
  await storage.ensureBucketExists();
})();
```

#### Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Upload single file (multipart/form-data, field: `file`) |
| `POST` | `/upload-multiple` | Upload up to 10 files (field: `files`) |
| `GET` | `/download/:key` | Download file by key (streams to client) |
| `GET` | `/url/:key` | Get signed URL (query: `?expires=3600`) |
| `GET` | `/list` | List objects (query: `?prefix=uploads/`) |
| `DELETE` | `/:key` | Delete object by key |

#### Upload Single File Route

```typescript
app.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate unique key with folder structure
    const timestamp = Date.now();
    const ext = path.extname(req.file.originalname);
    const key = `uploads/${timestamp}-${Math.random().toString(36).substring(7)}${ext}`;

    const result = await storage.uploadBuffer(key, req.file.buffer, {
      contentType: req.file.mimetype,
      metadata: {
        'original-name': req.file.originalname,
        'uploaded-at': new Date().toISOString()
      }
    });

    // Return signed URL for immediate access
    const signedUrl = await storage.getSignedUrl(key, 3600);

    res.json({
      success: true,
      key: result.key,
      url: signedUrl,
      expiresIn: 3600
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});
```

#### Upload Multiple Files Route

```typescript
app.post('/upload-multiple', upload.array('files', 10), async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploads = await Promise.all(
      req.files.map(async (file: Express.Multer.File) => {
        const key = `uploads/${Date.now()}-${file.originalname}`;
        await storage.uploadBuffer(key, file.buffer, {
          contentType: file.mimetype
        });
        return { key, name: file.originalname };
      })
    );

    res.json({ success: true, files: uploads });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
```

#### Download File Route

```typescript
app.get('/download/:key(*)', async (req: Request, res: Response) => {
  try {
    const key = req.params.key;

    await storage.streamToResponse(key, res, {
      filename: path.basename(key)
    });
  } catch (err: any) {
    if (err.name === 'NoSuchKey') {
      return res.status(404).json({ error: 'File not found' });
    }
    res.status(500).json({ error: err.message });
  }
});
```

#### Get Signed URL Route

```typescript
app.get('/url/:key(*)', async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const expires = parseInt(req.query.expires as string) || 3600;

    const url = await storage.getSignedUrl(key, expires);
    res.json({ url, expiresIn: expires });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
```

#### List Files Route

```typescript
app.get('/list', async (req: Request, res: Response) => {
  try {
    const prefix = (req.query.prefix as string) || '';
    const objects = await storage.listObjects(prefix);

    const result: StorageObject[] = objects.map(obj => ({
      key: obj.Key!,
      size: obj.Size!,
      lastModified: obj.LastModified!,
      url: storage.getPublicUrl(obj.Key!)
    }));

    res.json({ objects: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
```

#### Delete File Route

```typescript
app.delete('/:key(*)', async (req: Request, res: Response) => {
  try {
    await storage.deleteObject(req.params.key);
    res.json({ success: true, deleted: req.params.key });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
```

#### Error Handler

```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large' });
    }
  }
  res.status(500).json({ error: err.message });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

---

### Environment-Based Config

**File:** `src/config/s3.ts`

```typescript
import { S3Client } from '@aws-sdk/client-s3';

interface S3Config {
  region: string;
  endpoint?: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  forcePathStyle?: boolean;
}

function createS3Client(): S3Client {
  const env = process.env.NODE_ENV || 'development';

  if (env === 'development') {
    const config: S3Config = {
      region: 'us-east-1',
      endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || 'admin',
        secretAccessKey: process.env.MINIO_SECRET_KEY || 'password123'
      },
      forcePathStyle: true
    };
    return new S3Client(config);
  }

  // Production: Real AWS S3
  const config: S3Config = {
    region: process.env.AWS_REGION!,  // e.g., 'us-east-1'
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
    // No endpoint, no forcePathStyle — uses AWS defaults
  };
  return new S3Client(config);
}

const s3Client = createS3Client();
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'my-bucket';

export { s3Client, BUCKET_NAME };
```

#### `.env` File

```bash
# Development
NODE_ENV=development
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=password123
S3_BUCKET_NAME=my-bucket

# Production (switch to these)
# NODE_ENV=production
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=xxx
# AWS_SECRET_ACCESS_KEY=xxx
# S3_BUCKET_NAME=prod-bucket
```

---

## Testing Your Setup

### 1. Start MinIO

> **⚠️ EXECUTE SEPARATELY:** Run in terminal before starting your backend.

```bash
# If using Docker
docker start minio

# Or if using docker-compose
docker-compose up -d
```

### 2. Create Bucket in Console

> **⚠️ EXECUTE SEPARATELY:** Manual browser step.

Open `http://localhost:9001` and create a bucket.

### 3. Start Your Backend

```bash
npx ts-node src/app.ts
```

### 4. Test Upload

```bash
curl -X POST http://localhost:3000/upload \
  -F "file=@/path/to/your/image.png"
```

### 5. Test Download

Replace `KEY` with the actual key from the upload response:

```bash
curl http://localhost:3000/download/uploads/1234567890-image.png \
  -o downloaded.png
```

### 6. Get Signed URL

```bash
curl http://localhost:3000/url/uploads/1234567890-image.png
```

---

## Common Issues & Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `ECONNREFUSED` | MinIO not running | `docker start minio` |
| `SignatureDoesNotMatch` | Wrong credentials or missing `forcePathStyle` | Check both |
| `NoSuchBucket` | Bucket doesn't exist | Run `ensureBucketExists()` or create in console |
| `NoSuchKey` | Wrong object key | Check key path matches exactly |
| Upload hangs | File too large for memory | Use `uploadStream` or `uploadLargeFile` with multipart |
| URL doesn't work | Bucket is private | Use signed URLs or make bucket public in console |
| `Connection refused` | Port not exposed | Ensure `-p 9000:9000` and `-p 9001:9001` in docker run |
| Files disappear after restart | No volume mount | Add `-v ~/minio-data:/data` |
| `InvalidAccessKeyId` | Wrong credentials | Check `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD` |
| Can't access web console | Port 9001 not exposed | Add `-p 9001:9001` |
| TypeScript compilation errors | Missing `@types/node` | `npm install -D @types/node` |
| `response.Body` type errors | AWS SDK stream typing | Cast with `response.Body as Readable` |

---

## Important Concepts

| Concept | Explanation |
|---------|-------------|
| **Buckets** | Top-level containers (like a database). Names must be globally unique if using real S3, but locally anything works. |
| **Objects** | Files stored in buckets. Identified by a **Key** (path-like string). |
| **Keys** | The "path" of the object, e.g., `images/2024/photo.jpg`. MinIO has no real folders — it just uses prefixes. |
| **Presigned URLs** | Temporary access tokens. Give someone a URL that works for X seconds without exposing credentials. |
| **Path-style vs Virtual-hosted** | MinIO requires `forcePathStyle: true` (URL: `minio.com/bucket/object`). AWS S3 prefers virtual-hosted (`bucket.s3.com/object`). |
| **Regions** | MinIO ignores this. Set to anything. Real S3 requires the correct region. |
| **Multipart Upload** | Large files are split into chunks and uploaded in parallel. Supports resumability and progress tracking. |
| **Metadata** | Key-value pairs stored with the object. Useful for tracking upload info, user IDs, etc. |
| **Async Generators** | `listObjectsPaginated` uses `AsyncGenerator` for memory-efficient pagination over large buckets. |

---

## Project Structure

```
project/
├── src/
│   ├── config/
│   │   └── s3.ts              # S3/MinIO client configuration
│   ├── services/
│   │   └── storage.ts         # StorageService class with types
│   ├── app.ts                 # Express app with routes
│   └── types/
│       └── express.d.ts       # (Optional) Custom type declarations
├── docker-compose.yml         # (Optional) Docker Compose setup
├── .env                       # Environment variables
├── tsconfig.json              # TypeScript configuration
└── package.json
```

---

## tsconfig.json Example

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Next Steps

- Add `sharp` for image processing before upload
- Set up bucket policies for public/private access
- Configure MinIO with TLS for production-like local setup
- Set up distributed MinIO mode for testing multi-node scenarios
- Add unit tests with `jest` and mocked S3 client
- Implement file type validation with `file-type` package
