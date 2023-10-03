import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../libs/adapters/db/prisma/prisma.service';
import { CreatePostDto } from '../application/dto/create-post.dto';

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {}

  save(createPostDto: CreatePostDto, userId: string) {
    return this.prisma.post.create({
      data: {
        userId,
        description: createPostDto.description,
      },
    });
  }
}
