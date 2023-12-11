import { PrismaClient } from '@prisma/client';
import { s3Link } from '../apps/files-microservice/src/utils/generateS3Url';

function extendPrismaClient() {
  const prisma = new PrismaClient();
  return prisma.$extends({
    result: {
      user: {
        save: {
          needs: { id: true },
          compute(user) {
            return () =>
              prisma.user.update({
                where: { id: user.id },
                data: user,
              });
          },
        },
      },
      userProfile: {
        avatar: {
          needs: {
            avatar: true,
          },
          compute: (userProfile) => {
            if (userProfile.avatar) {
              return s3Link('user-avatars') + userProfile.avatar;
            }
            return userProfile.avatar;
          },
        },
      },
    },
  });
}

export const ExtendedPrismaClient = class {
  constructor() {
    return extendPrismaClient();
  }
} as new () => ReturnType<typeof extendPrismaClient>;
