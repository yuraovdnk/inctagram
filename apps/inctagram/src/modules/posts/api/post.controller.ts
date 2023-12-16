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
import { GetPostsFindOptions } from './dto/get-posts-find.options';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostCommand } from '../application/use-cases/commands/create-post.command.handler';
import { ApiCreatePost } from './swagger/api-create-post.swagger';
import { ApiGetPosts } from './swagger/api-get-posts.swagger';
import { PostViewModel } from './dto/post.view-model';
import { UploadPostImagePipe } from './pipes/upload-post-image.pipe';
import { DeletePostCommand } from '../application/use-cases/commands/delete-post.command.handler';
import { ApiDeletePost } from './swagger/api.delete-post.swagger';
import { EditPostDto } from './dto/edit-post.dto';
import { EditPostCommand } from '../application/use-cases/commands/edit-post.command.handler';
import { ApiUpdatePost } from './swagger/api-update-post.swagger';
import { GetPostQuery } from '../application/use-cases/queries/get-post-by-id.query.handler';
import { GetPostsQuery } from '../application/use-cases/queries/get-posts-query.handler';
import { PageDto } from '../../../../../../libs/common/dtos/pagination.dto';

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
    @Query() findOptions: GetPostsFindOptions,
    @Param('userId', new ParseUUIDPipe()) userId: string,
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
  ) {
    return this.commandBus.execute<EditPostCommand, NotificationResult>(
      new EditPostCommand(postId, userId, editPost),
    );
  }

  @Get('post/:id')
  async getPost(@Param('id', ParseUUIDPipe) postId: string) {
    return this.queryBus.execute(new GetPostQuery(postId));
  }
}
