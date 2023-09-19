import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigEnvType } from 'libs/common/config/env.config';
import { InternalServerError } from 'libs/common/notification/notification-result';
import {
  NotificationResult,
  SuccessResult,
} from '../../../../../../libs/common/notification/notification-result';
import { FileUploadUserAvatar } from '../../../../../../libs/contracts/file/file.upload-user-avatar';

@Injectable()
export class FileStorageService {
  private s3: S3Client;

  constructor(private configService: ConfigService<ConfigEnvType, true>) {
    const secrets = configService.get('secrets', { infer: true });
    this.s3 = new S3Client({
      region: secrets.awsRegion,
      credentials: {
        accessKeyId: secrets.awsAccessKeyId,
        secretAccessKey: secrets.awsSecretAccessKey,
      },
    });
  }
  async uploadUserAvatar(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    userId: string,
  ): Promise<NotificationResult<FileUploadUserAvatar.Response>> {
    const secrets = this.configService.get('secrets', { infer: true });
    const fileExt = originalName.split('.').pop();
    const fileName = `${userId}_avatar.${fileExt}`;

    const command: PutObjectCommandInput = {
      Bucket: secrets.awsBucket,
      Key: `user-avatars/${fileName}`,
      Body: buffer,
      ContentType: mimeType,
    };

    await this.s3.send(new PutObjectCommand(command)).catch((err) => {
      return new InternalServerError(err);
    });

    return new SuccessResult({
      fileName,
    });
  }
}
