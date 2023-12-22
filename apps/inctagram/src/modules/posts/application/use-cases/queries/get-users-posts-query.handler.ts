import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../../users/instrastructure/repository/users.repository';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';
import { GetUsersPostsFindOptions } from '../../../api/dto/get-users-posts.dto';
import { PageDto } from '../../../../../../../../libs/common/dtos/pagination.dto';
import { FilesServiceFacade } from '../../../../../clients/files-ms/files-service.fasade';
import { NotificationCodesEnum } from '../../../../../../../../libs/common/notification/notification-codes.enum';
import { PostViewModel } from '../../../api/dto/post.view-model';

export class GetUsersPostsQuery {
  constructor(
    readonly userId: string,
    readonly findOptions: GetUsersPostsFindOptions,
  ) {}
}

@QueryHandler(GetUsersPostsQuery)
export class GetUsersPostsQueryHandler implements IQueryHandler {
  constructor(
    private usersRepository: UsersRepository,
    private postsRepository: PostsRepository,
    private filesServiceFacade: FilesServiceFacade,
  ) {}
  async execute(
    query: GetUsersPostsQuery,
  ): Promise<NotificationResult<PageDto<PostViewModel>>> {
    const user = await this.usersRepository.findById(query.userId);

    if (!user) {
      return NotificationResult.Failure(
        NotificationCodesEnum.NOT_FOUND,
        'user not found',
      );
    }

    const [posts, count] = await this.postsRepository.getAllByUserId(
      user.id,
      query.findOptions,
    );

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
