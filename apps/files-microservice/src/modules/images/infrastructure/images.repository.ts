import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PostImage,
  PostImageDocument,
} from '../domain/entities/post-image.schema';
import { Injectable } from '@nestjs/common';

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
