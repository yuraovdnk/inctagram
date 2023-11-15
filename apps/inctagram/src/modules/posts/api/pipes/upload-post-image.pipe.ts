import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export class UploadPostImagePipe extends ParseFilePipe {
  constructor() {
    super({
      validators: [
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        //new MaxFileSizeValidator({ maxSize: 1048576 * 20 }),
      ],
      fileIsRequired: true,
    });
  }
}
