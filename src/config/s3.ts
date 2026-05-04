import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1", // MinIO ignores this, but required
  endpoint: "http://localhost:9000",
  credentials: {
    accessKeyId: "admin",
    secretAccessKey: "password123",
  },
  forcePathStyle: true, // CRITICAL: MinIO uses path-style URLs
  // Optional: increase timeouts for large files
  requestHandler: {
    requestTimeout: 300000, // 5 minutes
  },
});

const BUCKET_NAME = "my-bucket";

export { s3Client, BUCKET_NAME };
