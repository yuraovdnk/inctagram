import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostDto } from '../application/dto/create-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostCommand } from '../application/use-cases/commands/create-post.command.handler';
import crypto from 'crypto';

@Controller('post')
export class PostController {
  constructor(private commandBus: CommandBus) {}

  //TODO authorized user
  @Post('create')
  @UseInterceptors(FilesInterceptor('images', 10))
  async createPost(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createPostDto: CreatePostDto,
  ) {
    const userId = crypto.randomUUID(); //test
    await this.commandBus.execute<CreatePostCommand, unknown>(
      new CreatePostCommand(createPostDto, images, userId),
    );
  }
}
