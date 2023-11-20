import { Prisma } from '@prisma/client';
import { s3Link } from '../../apps/files-microservice/src/utils/generateS3Url';

export const concatS3Link = async (params: Prisma.MiddlewareParams, next) => {
  const result = await next(params);
  if (params.model === 'User' && params.action === 'findUnique') {
    if (result?.profile.avatar) {
      result.profile.avatar = s3Link('user-avatars') + result.profile.avatar;
    }
  }
  return next(params);
};
