import { PostImageViewModel } from '../../dtos/post-image.view-model';

export namespace FilesGetPostImages {
  export const topic = 'file.get-post-images.query';
  export class Request {
    postId: string;
  }

  export class Response {
    data: PostImageViewModel[];
  }
}
