import { IsUUID, Matches, MaxLength, MinLength } from 'class-validator';
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
  @MinLength(6)
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*\s)(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]).+$/,
    {
      message: 'newPassword is invalid',
    },
  )
  newPassword: string;

  @ApiProperty({
    description: 'password recovery code',
    required: true,
    format: 'uuid',
  })
  @IsUUID()
  recoveryCode: string;
}
