import { UserEntity } from '../../../../users/domain/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpViewDto {
  @ApiProperty({ format: 'email', example: 'test@email.com' })
  email: string;
  constructor(entity: UserEntity) {
    this.email = entity.email;
  }
}
