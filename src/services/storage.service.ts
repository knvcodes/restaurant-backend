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
  DeleteObjectsOutput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs";
import { Readable } from "stream";
import { Response } from "express";
import { UploadOptions, UploadResult } from "../utils/types";

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

  async ensureBucketExists(retries = 5): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
        console.log(`✓ Bucket '${this.bucket}' exists`);
        return;
      } catch (err: any) {
        if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
          await this.client.send(
            new CreateBucketCommand({ Bucket: this.bucket }),
          );
          console.log(`✓ Bucket '${this.bucket}' created`);
          return;
        }
        if (i === retries - 1) throw err;
        console.log(`⏳ Waiting for MinIO... (${i + 1}/${retries})`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  // ============================================
  // UPLOAD METHODS
  // ============================================

  async uploadBuffer(
    key: string,
    buffer: Buffer,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: options.contentType || "application/octet-stream",
      Metadata: options.metadata || {},
    });

    await this.client.send(command);
    return {
      key,
      bucket: this.bucket,
      url: await this.getSignedUrl(key, 3600),
      publicUrl: this.getPublicUrl(key),
    };
  }

  async uploadStream(
    key: string,
    stream: Readable,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: stream,
      ContentType: options.contentType || "application/octet-stream",
    });

    await this.client.send(command);
    return {
      key,
      bucket: this.bucket,
      url: await this.getSignedUrl(key, 3600),
      publicUrl: this.getPublicUrl(key),
    };
  }

  async uploadLargeFile(
    key: string,
    filePath: string,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    const fileStream = fs.createReadStream(filePath);

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: fileStream,
        ContentType: options.contentType || "application/octet-stream",
      },
      queueSize: 4,
      partSize: 5 * 1024 * 1024,
    });

    upload.on(
      "httpUploadProgress",
      (progress: { loaded: number; total: number }) => {
        const percent = ((progress.loaded / progress.total) * 100).toFixed(2);
        console.log(`Upload progress: ${percent}%`);
      },
    );

    await upload.done();
    return {
      key,
      bucket: this.bucket,
      url: await this.getSignedUrl(key, 3600),
      publicUrl: this.getPublicUrl(key),
    };
  }

  // ============================================
  // DOWNLOAD METHODS
  // ============================================

  async downloadBuffer(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.client.send(command);
    const chunks: Buffer[] = [];

    for await (const chunk of response.Body as Readable) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  async streamToResponse(
    key: string,
    res: Response,
    options: { contentType?: string; filename?: string } = {},
  ): Promise<void> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.client.send(command);

    res.setHeader(
      "Content-Type",
      options.contentType || response.ContentType || "application/octet-stream",
    );
    if (options.filename) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${options.filename}"`,
      );
    }
    if (response.ContentLength) {
      res.setHeader("Content-Length", response.ContentLength);
    }

    (response.Body as Readable).pipe(res);
  }

  // ============================================
  // URL GENERATION
  // ============================================

  async getSignedUrl(
    key: string,
    expiresIn: number = 3600,
    operation: "get" | "put" = "get",
  ): Promise<string> {
    const CommandClass =
      operation === "put" ? PutObjectCommand : GetObjectCommand;
    const command = new CommandClass({ Bucket: this.bucket, Key: key });
    return await getSignedUrl(this.client, command, { expiresIn });
  }

  getPublicUrl(key: string): string {
    const endpoint = (this.client.config as any).endpoint;
    return `${endpoint}/${this.bucket}/${key}`;
  }

  // ============================================
  // LISTING & DELETE
  // ============================================

  async listObjects(
    prefix: string = "",
    maxKeys: number = 1000,
  ): Promise<_Object[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
      MaxKeys: maxKeys,
    });
    const response = await this.client.send(command);
    return response.Contents || [];
  }

  async deleteObject(key: string): Promise<{ deleted: string }> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
    return { deleted: key };
  }

  async deleteObjects(
    keys: string[],
  ): Promise<{ deleted: string[]; errors: string[] }> {
    const response: DeleteObjectsOutput = await this.client.send(
      new DeleteObjectsCommand({
        Bucket: this.bucket,
        Delete: { Objects: keys.map((key) => ({ Key: key })) },
      }),
    );
    return {
      deleted: response.Deleted?.map((d) => d.Key!).filter(Boolean) || [],
      errors: response.Errors?.map((e) => e.Key!).filter(Boolean) || [],
    };
  }
}

export default StorageService;
