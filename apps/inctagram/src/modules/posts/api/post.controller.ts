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
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostDto } from './dto/create-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { NotificationResult } from '../../../../../../libs/common/notification/notification-result';
import { JwtGuard } from '../../auth/application/strategies/jwt.strategy';
import { CurrentUser } from '../../../../../../libs/common/decorators/current-user.decorator';
import { GetUsersPostsFindOptions } from './dto/get-users-posts.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostCommand } from '../application/use-cases/commands/create-post.command.handler';
import { ApiCreatePost } from './swagger/api-create-post.swagger';
import { ApiGetUsersPosts } from './swagger/api-get-users-posts.swagger';
import { PostViewModel } from './dto/post.view-model';
import { UploadPostImagePipe } from './pipes/upload-post-image.pipe';
import { DeletePostCommand } from '../application/use-cases/commands/delete-post.command.handler';
import { ApiDeletePost } from './swagger/api.delete-post.swagger';
import { EditPostDto } from './dto/edit-post.dto';
import { EditPostCommand } from '../application/use-cases/commands/edit-post.command.handler';
import { ApiUpdatePost } from './swagger/api-update-post.swagger';
import { GetPostQuery } from '../application/use-cases/queries/get-post-by-id.query.handler';
import { GetUsersPostsQuery } from '../application/use-cases/queries/get-users-posts-query.handler';
import { PageDto } from '../../../../../../libs/common/dtos/pagination.dto';
import { GetAllPostsQuery } from '../application/use-cases/queries/get-all-posts.query.handler';
import { ApiGetPosts } from './swagger/api-get-all-posts.swagger';
import { ApiGetPostById } from './swagger/api-get-post-by-id.swagger';
import { GetAllPostsFindOptions } from './dto/get-all-posts.dto';

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

  @ApiGetUsersPosts(PostViewModel)
  @Get(':userId')
  async getUsersPosts(
    @Query() findOptions: GetUsersPostsFindOptions,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.queryBus.execute<
      GetUsersPostsQuery,
      NotificationResult<PageDto<PostViewModel>>
    >(new GetUsersPostsQuery(userId, findOptions));
  }

  @ApiDeletePost()
  @Delete(':postId')
  @UseGuards(JwtGuard)
  async deletePost(
    @CurrentUser() userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.commandBus.execute<DeletePostCommand, NotificationResult>(
      new DeletePostCommand(postId, userId),
    );
  }

  @ApiUpdatePost()
  @Put(':postId')
  @UseGuards(JwtGuard)
  async editPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() userId: string,
    @Body() editPost: EditPostDto,
  ): Promise<NotificationResult> {
    return this.commandBus.execute<EditPostCommand, NotificationResult>(
      new EditPostCommand(postId, userId, editPost),
    );
  }

  @ApiGetPostById(PostViewModel)
  @Get('post/:id')
  async getPost(
    @Param('id', ParseUUIDPipe) postId: string,
  ): Promise<NotificationResult> {
    return this.queryBus.execute(new GetPostQuery(postId));
  }

  @ApiGetPosts(PostViewModel)
  @Get()
  async getAllPosts(
    @Query() findOptions: GetAllPostsFindOptions,
  ): Promise<NotificationResult> {
    return this.queryBus.execute(new GetAllPostsQuery(findOptions));
  }
}
