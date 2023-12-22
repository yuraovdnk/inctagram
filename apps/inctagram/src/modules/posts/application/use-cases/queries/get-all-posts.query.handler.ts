import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { GetUsersPostsFindOptions } from '../../../api/dto/get-users-posts.dto';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';
import { NotificationCodesEnum } from '../../../../../../../../libs/common/notification/notification-codes.enum';
import { PageDto } from '../../../../../../../../libs/common/dtos/pagination.dto';
import { PostViewModel } from '../../../api/dto/post.view-model';
import { FilesServiceFacade } from '../../../../../clients/files-ms/files-service.fasade';

export class GetAllPostsQuery {
  constructor(public readonly findOptions: GetUsersPostsFindOptions) {}
}

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsQueryHandler
  implements IQueryHandler<GetAllPostsQuery>
{
  constructor(
    private postsRepository: PostsRepository,
    private filesServiceFacade: FilesServiceFacade,
  ) {}

  async execute(query: GetAllPostsQuery) {
    const [posts, count] = await this.postsRepository.getAll(query.findOptions);

    for (const post of posts) {
      const resultOperation =
        await this.filesServiceFacade.queries.getPostImages(post.id);

      if (!!resultOperation.extensions.length) {
        return NotificationResult.Failure(
          NotificationCodesEnum.ERROR,
          'something went wrong',
        );
      }
      post.images.push(...resultOperation.data);
    }

    const paginated = new PageDto<PostViewModel>(
      posts.map((post) => new PostViewModel(post)),
      query.findOptions,
      count,
    );

    return NotificationResult.Success(paginated);
  }
}
