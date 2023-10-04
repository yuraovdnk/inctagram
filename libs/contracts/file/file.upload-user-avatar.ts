export namespace FileUploadUserAvatar {
  export const topic = 'file.upload-user-avatar.command';
  export class Request {
    userId: string;
    file: Express.Multer.File;
  }

  export class Response {
    fileName: string;
  }
}
