import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from '../../../../../core/common/validate-decorators/is-strong-password.validate.decorator';

export class NewPasswordDto {
  @ApiProperty({
    description: 'new password. ',
    required: true,
    type: 'string',
    minLength: 6,
    maxLength: 20,
    example: 'Testpass1_',
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
