import {
  IsEmail,
  IsNotEmpty,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewPasswordDto {
  @ApiProperty({
    description: 'new password',
    required: true,
    type: 'string',
    minLength: 6,
    maxLength: 20,
  })
  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
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
