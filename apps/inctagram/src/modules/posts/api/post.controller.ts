import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostDto } from '../application/dto/create-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { NotificationResult } from '../../../../../../libs/common/notification/notification-result';
import { JwtGuard } from '../../auth/application/strategies/jwt.strategy';
import { CurrentUser } from '../../../../../../libs/common/decorators/current-user.decorator';
import { GetPostsQuery } from '../application/use-cases/queries/get-posts-query.handler';
import { GetPostsFindOptions } from '../application/dto/get-posts-find.options';
import { PageDto } from '../../../../../../libs/common/dtos/pagination.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostCommand } from '../application/use-cases/commands/create-post.command.handler';
import { ApiCreatePost } from './swagger/api-create-post.swagger';
import { ApiGetPosts } from './swagger/api-get-posts.swagger';
import { PostViewModel } from '../application/dto/post.view-model';
import { UploadPostImagePipe } from './pipes/upload-post-image.pipe';
import { DeletePostCommand } from '../application/use-cases/commands/delete-post.command.handler';
import { ApiDeletePost } from './swagger/api.delete-post.swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @ApiCreatePost()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Post('create')
  @UseInterceptors(FilesInterceptor('images', 10))
  async createPost(
    @UploadedFiles(new UploadPostImagePipe())
    images: Express.Multer.File[],
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() userId: string,
  ) {
    return this.commandBus.execute<CreatePostCommand, NotificationResult>(
      new CreatePostCommand(createPostDto, images, userId),
    );
  }

  @ApiGetPosts(PostViewModel)
  @Get(':userId')
  async getPosts(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Query() findOptions: GetPostsFindOptions,
  ) {
    return this.queryBus.execute<
      GetPostsQuery,
      NotificationResult<PageDto<PostViewModel>>
    >(new GetPostsQuery(userId, findOptions));
  }

  @ApiDeletePost()
  @Delete(':postId')
  @UseGuards(JwtGuard)
  async deletePost(
    @CurrentUser() userId: string,
    @Param('postId') postId: string,
  ) {
    return this.commandBus.execute<DeletePostCommand, NotificationResult>(
      new DeletePostCommand(postId, userId),
    );
  }
}
