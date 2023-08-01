import {
  IsNotEmpty,
  IsStrongPassword,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewPasswordDto {
  @ApiProperty({
    description: 'new password. ',
    required: true,
    type: 'string',
    minLength: 6,
    maxLength: 20,
  })
  @MaxLength(20)
  @IsStrongPassword({
    minLength: 6,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword: string;

  @ApiProperty({
    description: 'password recovery code',
    required: true,
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  recoveryCode: string;
}
