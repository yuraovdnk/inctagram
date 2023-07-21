import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpDto } from '../../application/dto/signUp.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignupCommand } from '../../application/use-cases/command/signup.command-handler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.commandBus.execute<SignupCommand, void>(new SignupCommand());
  }
}
