import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../libs/adapters/db/prisma/prisma.service';
import { CreatePostDto } from '../application/dto/create-post.dto';
import { PostMapper } from './post.mapper';
import { GetPostsOptions } from '../application/dto/get-posts.options';
import { PostEntity } from '../domain/post.entity';

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
  async getAll(
    userId: string,
    findOptions: GetPostsOptions,
  ): Promise<[PostEntity[], number]> {
    const count = await this.prisma.post.count({
      where: {
        userId,
      },
    });
    const post = await this.prisma.post.findMany({
      where: {
        userId,
      },
      take: findOptions.pageSize,
      skip: findOptions.skip,
    });

    return [post.map((p) => PostMapper.toEntity(p)), count];
  }
}
