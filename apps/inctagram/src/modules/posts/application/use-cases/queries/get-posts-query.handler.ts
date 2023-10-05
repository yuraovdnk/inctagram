import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../../users/instrastructure/repository/users.repository';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { lastValueFrom } from 'rxjs';
import {
  NotFoundResult,
  NotificationResult,
  SuccessResult,
} from '../../../../../../../../libs/common/notification/notification-result';
import { FilesGetPostImages } from '../../../../../../../../libs/contracts/file/files.get-post-images';
import { PostImageViewModel } from '../../../../../../../../libs/dtos/post-image.view-model';
import { FILES_SERVICE } from '../../../../../clients/services.module';
import { GetPostsOptions } from '../../dto/get-posts.options';
import { PageDto } from '../../../../../../../../libs/common/dtos/pagination.dto';
import { PostEntity } from '../../../domain/post.entity';

export class GetPostsQuery {
  constructor(readonly userId: string, readonly findOptions: GetPostsOptions) {}
}

@QueryHandler(GetPostsQuery)
export class GetPostsQueryHandler implements IQueryHandler {
  constructor(
    private usersRepo: UsersRepository,
    @Inject(FILES_SERVICE) private clientTCP: ClientProxy,
    private postsRepo: PostsRepository,
  ) {}
  async execute(query: GetPostsQuery): Promise<any> {
    const user = await this.usersRepo.findById(query.userId);

    if (!user) {
      return new NotFoundResult('user is not exist');
    }

    const [posts, count] = await this.postsRepo.getAll(
      user.id,
      query.findOptions,
    );

    for (const post of posts) {
      const notificationResult = await lastValueFrom(
        this.clientTCP.send<
          NotificationResult<PostImageViewModel[]>,
          FilesGetPostImages.Request
        >(FilesGetPostImages.topic, {
          postId: post.id,
        }),
      );

      //TODO CHECK ERROR
      post.images.push(...notificationResult.data);
    }
    const paginated = new PageDto<PostEntity[]>(
      posts,
      query.findOptions,
      count,
    );
    return new SuccessResult(paginated);
  }
}
