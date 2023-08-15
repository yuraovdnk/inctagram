import { UserEntity } from '../../../../users/domain/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserInfoViewDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  constructor(entity: UserEntity) {
    this.userId = entity.id;
    this.username = entity.username;
    this.email = entity.email;
  }
}
