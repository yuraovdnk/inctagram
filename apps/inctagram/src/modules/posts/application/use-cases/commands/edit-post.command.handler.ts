import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';
import { NotificationCodesEnum } from '../../../../../../../../libs/common/notification/notification-codes.enum';
import { EditPostDto } from '../../../api/dto/edit-post.dto';

export class EditPostCommand {
  constructor(
    public postId: string,
    public userId: string,
    public editPostDto: EditPostDto,
  ) {}
}
@CommandHandler(EditPostCommand)
export class EditPostCommandHandler
  implements ICommandHandler<EditPostCommand>
{
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: EditPostCommand): Promise<NotificationResult> {
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
        'You don`t have permission to update this post',
      );
    }
    post.edit = command.editPostDto;
    await this.postsRepository.save(post);
    return NotificationResult.Success();
  }
}
