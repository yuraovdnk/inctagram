import { Module, Scope } from '@nestjs/common';
import { ImagesController } from './api/images.controller';
import { FileStorageService } from './infrastructure/file-storage.service';
import { CqrsModule } from '@nestjs/cqrs';
import { UploadAvatarCommandHandler } from './application/use-cases/commands/upload-avatar-command.handler';
import { UploadPostImagesCommandHandler } from './application/use-cases/commands/upload-post-images.command.handler';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ImageVersion,
  ImageVersionSchema,
  PostImage,
  PostImageSchema,
} from './domain/entities/post-image.schema';
import { ImagesRepository } from './infrastructure/images.repository';

import Piscina from 'piscina';

const commands = [UploadAvatarCommandHandler, UploadPostImagesCommandHandler];
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forRoot(
      'mongodb+srv://yuraovdnk:BRaKViSK5TEhLFkO@cluster0.sbzbx.mongodb.net/?retryWrites=true',
    ),
    MongooseModule.forFeature([
      { name: PostImage.name, schema: PostImageSchema },
      { name: ImageVersion.name, schema: ImageVersionSchema },
    ]),
  ],
  providers: [
    ...commands,
    FileStorageService,
    ImagesRepository,
    {
      provide: 'WorkerPool',
      useValue: new Piscina({
        filename: null,
        maxThreads: 8,
      }),
      scope: Scope.DEFAULT,
    },
  ],
  controllers: [ImagesController],

})
export class ImagesModule {}
