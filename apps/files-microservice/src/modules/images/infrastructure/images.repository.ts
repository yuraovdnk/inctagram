import { InjectModel } from '@nestjs/mongoose';
import {
  PostImage,
  PostImageDocument,
} from '../domain/entities/post-image.schema';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PostImageViewModel } from '../../../../../../libs/dtos/post-image.view-model';

@Injectable()
export class ImagesRepository {
  constructor(
    @InjectModel(PostImage.name)
    private postImageModel: Model<PostImageDocument>,
  ) {}

  async createPostImage(model: PostImage) {
    return this.postImageModel.create(model);
  }

  async getAll() {
    return this.postImageModel.find();
  }

  async getPostImages(postId: string) {
    const images = await this.postImageModel.aggregate([
      {
        $match: {
          postId,
        },
      },
      {
        $unwind: '$versions',
      },
      {
        $match: {
          'versions.variant': 'medium',
        },
      },
      {
        $replaceRoot: {
          newRoot: '$versions',
        },
      },
    ]);
    return images.map((image) => new PostImageViewModel(image));
  }
}
