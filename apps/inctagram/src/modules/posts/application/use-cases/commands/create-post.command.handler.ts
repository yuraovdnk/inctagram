import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostDto } from '../../dto/create-post.dto';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { FileUploadPostImages } from '../../../../../../../../libs/contracts/file/file.upload-post-images';

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
    @Inject('FILES_SERVICE') private clientTCP: ClientProxy,
  ) {}
  async execute(command: CreatePostCommand): Promise<any> {
    const post = await this.postsRepository.save(
      command.createPostDto,
      command.userId,
    );

    const resultUpload = await lastValueFrom(
      this.clientTCP.send<
        FileUploadPostImages.Response,
        FileUploadPostImages.Request
      >(FileUploadPostImages.topic, {
        userId: command.userId,
        postId: post.id,
        images: command.images,
      }),
    );
    console.log(resultUpload);
  }
}
