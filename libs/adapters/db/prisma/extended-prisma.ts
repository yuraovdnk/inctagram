import { Prisma, PrismaClient } from '@prisma/client';
import { s3Link } from '../../../../apps/files-microservice/src/utils/generateS3Url';

function extendPrismaClient() {
  const prisma = new PrismaClient();
  return prisma.$extends({
    model: {
      $allModels: {
        async save<T>(this: T, where: Prisma.Args<T, 'update'>['where']) {
          const context = Prisma.getExtensionContext(this);
          const result = await (context as any).upsert({
            where: {
              id: where.id,
            },
            update: where,
            create: where,
          });
        },
      },
    },
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
              return (
                s3Link('user-avatars') +
                userProfile.avatar +
                `?nocache=${Math.random()}`
              );
            }
            return userProfile.avatar;
          },
        },
      },
    },
  });
}

export type ExtendedPrismaClient = ReturnType<typeof extendPrismaClient>;

export const ExtendedPrismaClient = class {
  constructor() {
    return extendPrismaClient();
  }
} as new () => ExtendedPrismaClient;
