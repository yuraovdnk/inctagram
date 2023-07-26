import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpDto } from '../../application/dto/request/signUp.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignupCommand } from '../../application/use-cases/command/signup.command-handler';
import { PasswordRecoveryDto } from '../../application/dto/request/password-recovery.dto';
import { PasswordRecoveryCommand } from '../../application/use-cases/command/password-recovery.command-handler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { NewPasswordDto } from '../../application/dto/request/new-password.dto';
import { NewPasswordCommand } from '../../application/use-cases/command/new-password.command-handler';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @ApiOkResponse({
    description:
      'Input data is accepted. Email with confirmation code will be send to passed email address',
  })
  @ApiBadRequestResponse({
    description:
      'If the inputModel has incorrect values (in particular if the user with the given email or password already exists)',
  })
  @ApiBody({ type: SignUpDto })
  @ApiOperation({ summary: 'signup' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.commandBus.execute<SignupCommand, void>(
      new SignupCommand(signUpDto),
    );
  }

  //Password recovery
  @ApiOperation({
    summary:
      'Password recovery via Email confirmation. Email should be sent with RecoveryCode inside',
  })
  @ApiNoContentResponse({
    description:
      "Even if current email is not registered (for prevent user's email detection)",
  })
  @ApiBadRequestResponse({
    description: 'If the inputModel has invalid email',
  })
  @ApiTooManyRequestsResponse({
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @ApiBody({ type: PasswordRecoveryDto })
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('password-recovery')
  async passwordRecovery(@Body() passwordRecoveryDto: PasswordRecoveryDto) {
    await this.commandBus.execute<PasswordRecoveryCommand, Promise<boolean>>(
      new PasswordRecoveryCommand(passwordRecoveryDto.email),
    );
  }

  //New password
  @ApiOperation({ summary: 'Confirm Password recovery' })
  @ApiNoContentResponse({
    description: 'If code is valid and new password is accepted',
  })
  @ApiBadRequestResponse({
    description: 'If the inputModel has invalid email',
  })
  @ApiTooManyRequestsResponse({
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @ApiBody({ type: NewPasswordDto })
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('new-password')
  async newPassword(@Body() inputDto: NewPasswordDto) {
    await this.commandBus.execute<NewPasswordCommand, Promise<boolean>>(
      new NewPasswordCommand(inputDto.newPassword, inputDto.recoveryCode),
    );
  }

  //Logout
  @ApiOperation({
    summary:
      'In cookie client must send correct refreshToken that will be revoked',
  })
  @ApiNoContentResponse({
    description:
      'If the JWT refreshToken inside cookie is valid and user has been logged out',
  })
  @ApiUnauthorizedResponse({
    description:
      'If the JWT refreshToken inside cookie is missing, expired or incorrect',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout() {
    return;
  }
}
