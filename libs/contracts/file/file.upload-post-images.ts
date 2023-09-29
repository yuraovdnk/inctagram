export namespace FileUploadPostImages {
  export const topic = 'file.upload-post-images.command';
  export class Request {
    postId: string;
    images: Express.Multer.File[];
  }

  export class Response {}
}
