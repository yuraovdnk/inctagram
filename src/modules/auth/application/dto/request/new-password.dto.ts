import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from '../decorators/is-strong-password.validate.decorator';

export class NewPasswordDto {
  @ApiProperty({
    description: 'new password. ',
    required: true,
    type: 'string',
    minLength: 6,
    maxLength: 20,
  })
  @IsStrongPassword()
  newPassword: string;

  @ApiProperty({
    description: 'password recovery code',
    required: true,
    format: 'uuid',
  })
  @IsUUID()
  recoveryCode: string;
}
