import { Length } from 'class-validator';

export class CreatePostDto {
  @Length(0, 500)
  description: string;
}
