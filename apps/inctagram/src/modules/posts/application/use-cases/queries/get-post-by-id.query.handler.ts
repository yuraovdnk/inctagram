import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';
import { NotificationCodesEnum } from '../../../../../../../../libs/common/notification/notification-codes.enum';
import { FilesServiceFacade } from '../../../../../clients/files-ms/files-service.fasade';
import { PostViewModel } from '../../../api/dto/post.view-model';

export class GetPostQuery {
  constructor(public readonly postId: string) {}
}
@QueryHandler(GetPostQuery)
export class GetPostByIdQueryHandler implements IQueryHandler {
  constructor(
    private postsRepository: PostsRepository,
    private filesServiceFacade: FilesServiceFacade,
  ) {}
  async execute(query: GetPostQuery) {
    const post = await this.postsRepository.getById(query.postId);
    if (!post) {
      return NotificationResult.Failure(
        NotificationCodesEnum.NOT_FOUND,
        'post not found',
      );
    }

    const resultOperation = await this.filesServiceFacade.queries.getPostImages(
      post.id,
    );
    post.images.push(...resultOperation.data);
    return NotificationResult.Success(new PostViewModel(post));
  }
}
