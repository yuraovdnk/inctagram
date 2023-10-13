import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';
import { NotificationCodesEnum } from '../../../../../../../../libs/common/notification/notification-codes.enum';

export class DeletePostCommand {
  constructor(public readonly postId: string, public readonly userId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostCommandHandler
  implements ICommandHandler<DeletePostCommand>
{
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: DeletePostCommand): Promise<NotificationResult> {
    const post = await this.postsRepository.getById(command.postId);
    if (!post) {
      return NotificationResult.Failure(
        NotificationCodesEnum.NOT_FOUND,
        'post not found',
      );
    }
    if (post.userId !== command.userId) {
      return NotificationResult.Failure(
        NotificationCodesEnum.NOT_FOUND,
        'You don`t have permission to delete this post',
      );
    }
    await this.postsRepository.deletePost(command.postId);
    return NotificationResult.Success();
  }
}
