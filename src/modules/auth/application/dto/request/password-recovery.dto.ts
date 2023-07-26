import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordRecoveryDto {
  @ApiProperty({
    description: 'email',
    required: true,
    type: 'string',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'email is required' })
  email: string;
}
