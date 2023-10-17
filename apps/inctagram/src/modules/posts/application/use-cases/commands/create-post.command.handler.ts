import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostDto } from '../../../api/dto/create-post.dto';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';
import { FilesServiceFacade } from '../../../../../clients/files-ms/files-service.fasade';
import { UsersRepository } from '../../../../users/instrastructure/repository/users.repository';
import { NotificationCodesEnum } from '../../../../../../../../libs/common/notification/notification-codes.enum';

export class CreatePostCommand {
  constructor(
    readonly createPostDto: CreatePostDto,
    readonly images: Express.Multer.File[],
    readonly userId: string,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
    private filesServiceFacade: FilesServiceFacade,
  ) {}
  async execute(command: CreatePostCommand): Promise<NotificationResult> {
    const user = await this.usersRepository.getUserProfile(command.userId);

    if (!user.profile) {
      return NotificationResult.Failure(
        NotificationCodesEnum.FORBIDDEN,
        'user have to create profile',
      );
    }

    const post = await this.postsRepository.create(
      command.createPostDto,
      command.userId,
    );

    const resultUpload =
      await this.filesServiceFacade.commands.uploadPostImages(
        post.id,
        command.userId,
        command.images,
      );

    if (!!resultUpload.extensions.length) {
      return resultUpload;
    }
    return NotificationResult.Success();
  }
}
