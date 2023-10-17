import { EditPostDto } from '../api/dto/edit-post.dto';

export class PostEntity {
  createdAt: Date | null;
  description: string;
  id: string;
  location: string | null;
  deleted: boolean;
  userId: string;
  images: any[] = [];

  set edit(editDto: EditPostDto) {
    this.description = editDto.description;
  }
}
