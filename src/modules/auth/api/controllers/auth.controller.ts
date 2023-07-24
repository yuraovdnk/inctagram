import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpDto } from '../../application/dto/signUp.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupCommand } from '../../application/use-cases/command/signup.command-handler';
import { PasswordRecoveryDto } from '../../application/dto/password-recovery.dto';
import { PasswordRecoveryCommand } from '../../application/use-cases/command/password-recovery.command-handler';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.commandBus.execute<SignupCommand, void>(new SignupCommand());
  }

  //Password recovery
  @ApiOperation({ summary: 'Password recovery' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description:
      "Even if current email is not registered (for prevent user's email detection)",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'If the inputModel has invalid email',
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
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
}
