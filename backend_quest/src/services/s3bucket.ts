import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

export interface S3UploadParams {
  file: File;
  fileKey: string;
  buffer: Buffer;
}

export const sendToS3Client = async (file: S3UploadParams) => {
  const result = await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: file.fileKey,
      Body: file.buffer,
      ContentType: file.file.type,
    }),
  );
};

export const getURL = (fileKey: string) => {
  const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(fileKey)}`;
  return url;
};

export const deleteFromS3Client = async (fileKey: string) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });
  await s3Client.send(command);
};

export const getFromS3Client = async (fileKey: string) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  const response = await s3Client.send(command);
  return response;
};
