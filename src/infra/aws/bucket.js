import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

function setS3Client() {
  return new S3Client({
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretAccessKey,
    },
    region: bucketRegion,
  });
}

function defineObjectParams(imageName) {
  return {
    Bucket: bucketName,
    Key: imageName,
  };
}

export async function getBucketObject(imageName) {
  const s3Client = setS3Client();

  const command = new GetObjectCommand(defineObjectParams(imageName));
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function putBucketObject(params) {
  const s3Client = setS3Client();

  const command = new PutObjectCommand(params);
  const result = await s3Client.send(command);
  if (result.$metadata.httpStatusCode != 200) {
    console.warn("There was an error loading image to s3 Bucket");
  }
  return result;
}
