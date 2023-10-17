import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../libs/adapters/db/prisma/prisma.service';
import { CreatePostDto } from '../api/dto/create-post.dto';
import { PostMapper } from './post.mapper';
import { GetPostsFindOptions } from '../api/dto/get-posts-find.options';
import { PostEntity } from '../domain/post.entity';

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {}

  create(createPostDto: CreatePostDto, userId: string) {
    return this.prisma.post.create({
      data: {
        userId,
        description: createPostDto.description,
      },
    });
  }
  async getAll(
    userId: string,
    findOptions: GetPostsFindOptions,
  ): Promise<[PostEntity[], number]> {
    const [posts, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          userId,
          deleted: false,
        },
        take: findOptions.pageSize,
        skip: findOptions.skip,
      }),
      this.prisma.post.count({
        where: {
          userId,
        },
      }),
    ]);

    return [posts.map((post) => PostMapper.toEntity(post)), totalCount];
  }
  async getById(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
        deleted: false,
      },
    });
    return post ? PostMapper.toEntity(post) : null;
  }

  async deletePost(postId: string) {
    return this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        deleted: true,
      },
    });
  }
  async save(post: PostEntity) {
    const model = PostMapper.toModel(post);
    await this.prisma.post.update({
      where: {
        id: post.id,
      },
      data: model,
    });
  }
}
