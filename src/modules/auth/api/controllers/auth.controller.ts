import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpDto } from '../../application/dto/signUp.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupCommand } from '../../application/use-cases/command/signup.command-handler';
import { PasswordRecoveryDto } from '../../application/dto/password-recovery.dto';
import { PasswordRecoveryCommand } from '../../application/use-cases/command/password-recovery.command-handler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.commandBus.execute<SignupCommand, void>(new SignupCommand());
  }

  //Password recovery
  @ApiOperation({ summary: 'Password recovery' })
  @ApiResponse({
    status: 204,
    description: 'No content',
  })
  @ApiResponse({
    status: 400,
    description: 'If input data is incorrect',
  })
  @ApiBody({ type: PasswordRecoveryDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('password-recovery')
  async passwordRecovery(@Body() passwordRecoveryDto: PasswordRecoveryDto) {
    const res = await this.commandBus.execute<
      PasswordRecoveryCommand,
      Promise<boolean>
    >(new PasswordRecoveryCommand(passwordRecoveryDto.email));
    if (res) return;
  }
}
