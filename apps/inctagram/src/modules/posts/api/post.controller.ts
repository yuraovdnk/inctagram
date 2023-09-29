import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostDto } from '../application/dto/create-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostCommand } from '../application/use-cases/commands/create-post.command.handler';
import crypto from 'crypto';
import { NotificationResult } from '../../../../../../libs/common/notification/notification-result';
import { JwtGuard } from '../../auth/application/strategies/jwt.strategy';
import { CurrentUser } from '../../../../../../libs/common/decorators/current-user.decorator';

@Controller('post')
export class PostController {
  constructor(private commandBus: CommandBus) {}

  //TODO authorized user
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

  @Get()
  getAll() {}

  @Delete(':id')
  async deletePost(@Param('id') id: string) {}
}
