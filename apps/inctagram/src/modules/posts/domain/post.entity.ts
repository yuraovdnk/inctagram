export class PostEntity {
  createdAt: Date | null;
  description: string;
  id: string;
  location: string | null;
  userId: string;
  images: any[] = [];
}
