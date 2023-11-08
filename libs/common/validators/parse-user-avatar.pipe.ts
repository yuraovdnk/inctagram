import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export class ParseUserAvatarPipe extends ParseFilePipe {
  constructor() {
    super({
      validators: [
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        new MaxFileSizeValidator({ maxSize: 1048576 * 10 }),
      ],
      fileIsRequired: true,
    });
  }
}
