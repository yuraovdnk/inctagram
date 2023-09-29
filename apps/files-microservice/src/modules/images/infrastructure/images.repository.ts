import { InjectModel } from '@nestjs/mongoose';
import {
  PostImage,
  PostImageDocument,
} from '../domain/entities/post-image.schema';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

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
}
