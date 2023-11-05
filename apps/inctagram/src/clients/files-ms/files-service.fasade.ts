import { Inject, Injectable } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { NotificationResult } from '../../../../../libs/common/notification/notification-result';
import { PostImageViewModel } from '../../../../../libs/dtos/post-image.view-model';
import { FilesGetPostImages } from '../../../../../libs/contracts/file/files.get-post-images';
import { FileUploadPostImages } from '../../../../../libs/contracts/file/file.upload-post-images';
import { FileUploadUserAvatar } from '../../../../../libs/contracts/file/file.upload-user-avatar';
import { FileDeleteUserAvatar } from '../../../../../libs/contracts/file/file.delete-user-avatar';

@Injectable()
export class FilesServiceFacade {
  constructor(@Inject('FILES_SERVICE') private clientTCP: ClientProxy) {}

  queries = {
    getPostImages: (postId: string) => this.getPostImages(postId),
  };
  commands = {
    uploadPostImages: (
      postId: string,
      userId: string,
      images: Express.Multer.File[],
    ) => this.uploadPostImages(postId, userId, images),

    uploadUserAvatar: (userId: string, file: Express.Multer.File) =>
      this.uploadUserAvatar(userId, file),

    deleteUserAvatar: (fileName: string) => this.deleteUserAvatar(fileName),
  };

  private async getPostImages(
    postId: string,
  ): Promise<NotificationResult<PostImageViewModel[]>> {
    const notificationResult = await lastValueFrom(
      this.clientTCP.send<
        NotificationResult<PostImageViewModel[]>,
        FilesGetPostImages.Request
      >(FilesGetPostImages.topic, {
        postId,
      }),
    );
    return notificationResult;
  }

  private async uploadPostImages(
    postId: string,
    userId: string,
    images: Express.Multer.File[],
  ) {
    const resultUpload = await lastValueFrom(
      this.clientTCP.send<NotificationResult, FileUploadPostImages.Request>(
        FileUploadPostImages.topic,
        {
          postId,
          userId,
          images,
        },
      ),
    );
    return resultUpload;
  }
  private async uploadUserAvatar(userId: string, file: Express.Multer.File) {
    const resultUploadFile = await lastValueFrom(
      this.clientTCP.send<
        NotificationResult<FileUploadUserAvatar.Response>,
        FileUploadUserAvatar.Request
      >(FileUploadUserAvatar.topic, {
        userId,
        file,
      }),
    );
    return resultUploadFile;
  }

  private async deleteUserAvatar(filename: string) {
    const resultUploadFile = await lastValueFrom(
      this.clientTCP.send<
        NotificationResult<FileDeleteUserAvatar.Response>,
        FileDeleteUserAvatar.Request
      >(FileDeleteUserAvatar.topic, {
        filename,
      }),
    );
    return resultUploadFile;
  }
}
