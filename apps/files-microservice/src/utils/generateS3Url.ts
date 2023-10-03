export const generateS3Url = (bucket: string, key: string, region: string) => {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};
