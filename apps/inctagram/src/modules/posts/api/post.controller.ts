import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostDto } from '../application/dto/create-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostCommand } from '../application/use-cases/commands/create-post.command.handler';
import { NotificationResult } from '../../../../../../libs/common/notification/notification-result';
import { JwtGuard } from '../../auth/application/strategies/jwt.strategy';
import { CurrentUser } from '../../../../../../libs/common/decorators/current-user.decorator';
import { GetPostsQuery } from '../application/use-cases/queries/get-posts-query.handler';
import { UserProfileViewDto } from '../../users/application/dto/response/user-profile.view.dto';
import { GetPostsOptions } from '../application/dto/get-posts.options';

@Controller('posts')
export class PostController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @UseGuards(JwtGuard)
  @Post('create')
  @UseInterceptors(FilesInterceptor('images', 10))
  async createPost(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() userId: string,
  ) {
    await this.commandBus.execute<CreatePostCommand, NotificationResult>(
      new CreatePostCommand(createPostDto, images, userId),
    );
  }

  //TODO SWAGGER
  @Get(':userId')
  async getPosts(
    @Param('userId') userId: string,
    @Query() findOptions: GetPostsOptions,
  ) {
    return this.queryBus.execute<GetPostsQuery, UserProfileViewDto>(
      new GetPostsQuery(userId, findOptions),
    );
  }
}
