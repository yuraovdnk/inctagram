import process from 'process';

export const generateS3Url = (bucket: string, key: string, region: string) => {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

export const s3Link = (key: string) => {
  const bucketName = process.env.BUCKET;
  const bucketRegion = process.env.AWS_S3_REGION;
  return `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${key}/`;
};
