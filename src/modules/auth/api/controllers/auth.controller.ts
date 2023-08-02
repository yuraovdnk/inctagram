import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpDto } from '../../application/dto/request/signUp.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { SignupCommand } from '../../application/use-cases/command/signup.command-handler';
import { PasswordRecoveryDto } from '../../application/dto/request/password-recovery.dto';
import { PasswordRecoveryCommand } from '../../application/use-cases/command/password-recovery.command-handler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LocalAuthGuard } from '../../application/strategies/local.strategy';
import { AuthService } from '../../application/service/auth.service';
import { CurrentUser } from '../../../../core/common/decorators/current-user.decorator';
import { Response } from 'express';
import { EmailConfirmCommand } from '../../application/use-cases/command/email-confirm.command.handler';
import {
  DeviceInfoType,
  DeviceMeta,
} from '../../../../core/common/decorators/device-info.decorator';
import { CreateAuthSessionCommand } from '../../application/use-cases/command/create-auth-session.command.handler';
import { LoginRequired } from '../../application/dto/swagger/login-required.swagger.decorator';
import { SignupRequired } from '../../application/dto/swagger/signup-required.swagger.decorator';
import { RegistrationConfirmationRequired } from '../../application/dto/swagger/registration-confirmation-required.swagger.decorator';
import { PasswordRecoveryRequired } from '../../application/dto/swagger/password-recovery.swagger.decorator';
import { ConfigService } from '@nestjs/config';
import { ConfigEnvType } from '../../../../core/common/config/env.config';
import { NewPasswordDto } from '../../application/dto/request/new-password.dto';
import { NewPasswordCommand } from '../../application/use-cases/command/new-password.command-handler';
import { JwtCookieGuard } from '../../application/strategies/jwt-cookie.strategy';
import { KillAuthSessionCommand } from '../../application/use-cases/command/kill-auth-session.command.handler';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private readonly authService: AuthService,
    private configService: ConfigService<ConfigEnvType, boolean>,
  ) {}

  //register in the system
  @SignupRequired()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.commandBus.execute<SignupCommand, void>(
      new SignupCommand(signUpDto),
    );
  }

  //registration-confirmation
  @RegistrationConfirmationRequired()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-confirmation')
  async confirmationEmail(@Body('code', ParseUUIDPipe) code: string) {
    return this.commandBus.execute(new EmailConfirmCommand(code));
  }

  //login in the system
  @LoginRequired()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Res() res: Response,
    @CurrentUser() userId: string,
    @DeviceMeta() deviceInfo: DeviceInfoType,
  ) {
    const tokens = this.authService.generateTokens(userId, deviceInfo.deviceId);
    await this.commandBus.execute(
      new CreateAuthSessionCommand(tokens.refreshToken, deviceInfo, userId),
    );
    res.cookie('refreshToken', tokens.refreshToken, {
      // httpOnly: true,
      // secure: true,
    });
    res.status(200).send({ accessToken: tokens.accessToken });
  }

  //Password recovery
  @PasswordRecoveryRequired()
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
  @UseGuards(JwtCookieGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(
    @DeviceMeta() deviceInfo: DeviceInfoType,
    @CurrentUser() user: string,
  ) {
    await this.commandBus.execute<KillAuthSessionCommand, void>(
      new KillAuthSessionCommand(),
    );
  }
}
