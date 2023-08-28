import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpDto } from '../../application/dto/request/sign-up.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { PasswordRecoveryDto } from '../../application/dto/request/password-recovery.dto';
import { PasswordRecoveryCommand } from '../../application/use-cases/command/password-recovery.command-handler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LocalAuthGuard } from '../../application/strategies/local.strategy';
import { AuthService, JwtTokens } from '../../application/service/auth.service';
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
import { NewPasswordDto } from '../../application/dto/request/new-password.dto';
import { NewPasswordCommand } from '../../application/use-cases/command/new-password.command-handler';
import { JwtCookieGuard } from '../../application/strategies/jwt-cookie.strategy';
import { KillAuthSessionCommand } from '../../application/use-cases/command/kill-auth-session.command.handler';
import { LogoutRequired } from '../../application/dto/swagger/logout-required.swagger.decorator';
import { RefreshTokenRequired } from '../../application/dto/swagger/refresh-tooken-required.swagger.decorator';
import { ResendConfirmationEmailDto } from '../../application/dto/request/resend-confirmation-email.dto';
import {
  NotificationResult,
  SuccessResult,
} from '../../../../core/common/notification/notification-result';
import { ResendEmailConfirmationCommand } from '../../application/use-cases/command/resend-email-confirmation.command.handler';
import { RegistrationEmailResendingRequiredSwaggerDecorator } from '../../application/dto/swagger/registration-email-resending-required.swagger-decorator';
import { UsersRepository } from '../../../users/instrastructure/repository/users.repository';
import { UserInfoViewDto } from '../../application/dto/response/user-info.view.dto';
import { JwtGuard } from '../../../../core/common/guards/jwt.guard';
import { MeRequiredSwaggerDecorator } from '../../application/dto/swagger/me-required.swagger-decorator';
import { SignupCommand } from '../../application/use-cases/command/signup.command-handler';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
  ) {}

  //register in the system
  @SignupRequired()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) /*: Promise<NotificationResult>*/ {
    return this.commandBus.execute<SignupCommand, NotificationResult>(
      new SignupCommand(signUpDto),
    );
  }

  //registration-confirmation
  @RegistrationConfirmationRequired()
  @HttpCode(HttpStatus.OK)
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
    const result = await this.commandBus.execute<
      CreateAuthSessionCommand,
      NotificationResult<JwtTokens>
    >(new CreateAuthSessionCommand(deviceInfo, userId));

    res.cookie('refreshToken', result.data.refreshToken, {
      // httpOnly: true,
      // secure: true,
    });
    res.status(200).send({ accessToken: result.data.accessToken });
  }

  //Password recovery
  @PasswordRecoveryRequired()
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  @Post('new-password')
  async newPassword(@Body() inputDto: NewPasswordDto) {
    await this.commandBus.execute<NewPasswordCommand, Promise<boolean>>(
      new NewPasswordCommand(inputDto.newPassword, inputDto.recoveryCode),
    );
  }

  //Logout
  @LogoutRequired()
  @UseGuards(JwtCookieGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @DeviceMeta() deviceInfo: DeviceInfoType,
    @CurrentUser() userId: string,
    @Res() res: Response,
  ) {
    await this.commandBus.execute<KillAuthSessionCommand, void>(
      new KillAuthSessionCommand(userId, deviceInfo.deviceId),
    );
    res.clearCookie('refreshToken');
    res.sendStatus(HttpStatus.OK);
  }

  //refreshToken
  @RefreshTokenRequired()
  @UseGuards(JwtCookieGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(
    @DeviceMeta() deviceInfo: DeviceInfoType,
    @CurrentUser() userId: string,
    @Res() res: Response,
  ) {
    const result = await this.commandBus.execute<
      CreateAuthSessionCommand,
      NotificationResult<JwtTokens>
    >(new CreateAuthSessionCommand(deviceInfo, userId));

    res.cookie('refreshToken', result.data.refreshToken, {
      // httpOnly: true,
      // secure: true,
    });
    res.status(200).send({ accessToken: result.data.accessToken });
  }

  @RegistrationEmailResendingRequiredSwaggerDecorator()
  @HttpCode(HttpStatus.OK)
  @Post('registration-email-resending')
  async resendEmailConfirmation(
    @Body() resendConfirmationEmailDto: ResendConfirmationEmailDto,
  ): Promise<NotificationResult> {
    return this.commandBus.execute<
      ResendEmailConfirmationCommand,
      NotificationResult
    >(new ResendEmailConfirmationCommand(resendConfirmationEmailDto));
  }

  @MeRequiredSwaggerDecorator()
  @UseGuards(JwtGuard)
  @Get('me')
  async getAuthInfo(
    @CurrentUser() userId: string,
  ): Promise<NotificationResult<UserInfoViewDto>> {
    const user = await this.usersRepository.findById(userId);
    if (!user) new UnauthorizedException();
    return new SuccessResult(new UserInfoViewDto(user));
  }
}
