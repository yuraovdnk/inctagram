import { Module } from '@nestjs/common';
import { PostController } from './api/post.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostCommandHandler } from './application/use-cases/commands/create-post.command.handler';
import { PostsRepository } from './infrastructure/posts.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import process from 'process';

const commandHandlers = [CreatePostCommandHandler];
@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'FILES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.FILE_SERVICE_HOST,
          port: +process.env.FILE_SERVICE_PORT,
        },
      },
    ]),
  ],
  exports: [],
  providers: [...commandHandlers, PostsRepository],
  controllers: [PostController],
})
export class PostsModule {}
