import { PostImageViewModel } from '../../dtos/post-image.view-model';

export namespace FilesGetAllPosts {
  export const topic = 'file.get-all-posts.query';
  export class Request {}

  export class Response {
    data: PostImageViewModel[];
  }
}
