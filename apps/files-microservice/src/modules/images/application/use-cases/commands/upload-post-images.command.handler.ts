import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileStorageService } from '../../../infrastructure/file-storage.service';

export class UploadPostImagesCommand {
  constructor(
    public postImages: Express.Multer.File[],
    public userId: string,
    public postId: string,
  ) {}
}

@CommandHandler(UploadPostImagesCommand)
export class UploadPostImagesCommandHandler
  implements ICommandHandler<UploadPostImagesCommand>
{
  constructor(private fileService: FileStorageService) {}

  async execute(command: UploadPostImagesCommand) {
    console.log(command.postImages);
  }
}
