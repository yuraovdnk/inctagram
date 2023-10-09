import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export class UploadPostImagePipe extends ParseFilePipe {
  constructor() {
    super({
      validators: [
        new FileTypeValidator({ fileType: '.(jpeg|png)' }),
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 20 }),
      ],
      fileIsRequired: true,
    });
  }
}
