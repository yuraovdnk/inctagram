import { UserEntity } from '../../../../users/domain/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserInfoViewDto {
  @ApiProperty({ format: 'uuid' })
  userId: string;
  @ApiProperty({ example: 'Username' })
  username: string;
  @ApiProperty({ format: 'email' })
  email: string;
  constructor(entity: UserEntity) {
    this.userId = entity.id;
    this.username = entity.username;
    this.email = entity.email;
  }
}
