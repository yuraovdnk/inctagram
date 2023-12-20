import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignUpDto } from '../../application/dto/request/sign-up.dto';
import { ApiTags } from '@nestjs/swagger';
import { PasswordRecoveryDto } from '../../application/dto/request/password-recovery.dto';
import { PasswordRecoveryCommand } from '../../application/use-cases/command/password-recovery.command-handler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LocalAuthGuard } from '../../application/strategies/local.strategy';
import { JwtTokens } from '../../application/service/auth.service';
import { CurrentUser } from '../../../../../../../libs/common/decorators/current-user.decorator';
import { Response } from 'express';
import { EmailConfirmCommand } from '../../application/use-cases/command/email-confirm.command.handler';
import {
  DeviceInfoType,
  DeviceMeta,
} from '../../../../../../../libs/common/decorators/device-info.decorator';
import { CreateAuthSessionCommand } from '../../application/use-cases/command/create-auth-session.command.handler';
import { LoginRequired } from '../../application/dto/swagger/login-required.swagger.decorator';
import { SignupRequired } from '../../application/dto/swagger/signup-required.swagger.decorator';
import { RegistrationConfirmationRequired } from '../../application/dto/swagger/registration-confirmation-required.swagger.decorator';
import { ApiPasswordRecovery } from '../../application/dto/swagger/password-recovery.swagger.decorator';
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
} from '../../../../../../../libs/common/notification/notification-result';
import { ResendEmailConfirmationCommand } from '../../application/use-cases/command/resend-email-confirmation.command.handler';
import { RegistrationEmailResendingRequiredSwaggerDecorator } from '../../application/dto/swagger/registration-email-resending-required.swagger-decorator';
import { UsersRepository } from '../../../users/instrastructure/repository/users.repository';
import { UserInfoViewDto } from '../../application/dto/response/user-info.view.dto';
import { JwtGuard } from '../../../../../../../libs/common/guards/jwt.guard';
import { SignupCommand } from '../../application/use-cases/command/signup.command-handler';
import { ApiGetUserInfo } from '../../application/dto/swagger/me-required.swagger-decorator';
import { ApiNewPassword } from '../../application/dto/swagger/new-password.swagger.decorator';
import { SignUpViewDto } from '../../application/dto/response/sign-up.view.dto';
import { LoginViewDto } from '../../application/dto/response/login.view.dto';
import { RefreshTokenViewDto } from '../../application/dto/response/refresh-token.view.dto';
import { NotificationCodesEnum } from '../../../../../../../libs/common/notification/notification-codes.enum';
import { GetAuthSessionsQuery } from '../../application/use-cases/queries/get-auth-sessions.query.handler';
import { AuthRepository } from '../../infrastructure/repository/auth.repository';
import { ApiGetAuthSessions } from '../../application/dto/swagger/get-auth-sessions.swagger.api';
import { AuthSessionViewDto } from '../../application/dto/response/auth-session.view.dto';
import { ApiTerminateAuthSession } from '../../application/dto/swagger/terminate-auth-session.swagger.api';
import { ApiTerminateAllAuthSessions } from '../../application/dto/swagger/terminate-all-auth-sessions.swagger-api';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private readonly usersRepository: UsersRepository,
    private authRepository: AuthRepository,
  ) {}

  //register in the system
  @SignupRequired(SignUpViewDto)
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<NotificationResult> {
    return this.commandBus.execute<SignupCommand, NotificationResult>(
      new SignupCommand(signUpDto),
    );
  }

  //registration-confirmation
  @RegistrationConfirmationRequired()
  @HttpCode(HttpStatus.OK)
  @Post('registration-confirmation')
  async confirmationEmail(@Body('code', ParseUUIDPipe) code: string) {
    return this.commandBus.execute<EmailConfirmCommand, NotificationResult>(
      new EmailConfirmCommand(code),
    );
  }

  //login in the system
  @LoginRequired(LoginViewDto)
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
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
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res
      .status(200)
      .send(new SuccessResult({ accessToken: result.data.accessToken }));
  }

  //Password recovery
  @ApiPasswordRecovery()
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Post('password-recovery')
  async passwordRecovery(
    @Body() passwordRecoveryDto: PasswordRecoveryDto,
  ): Promise<NotificationResult> {
    return await this.commandBus.execute<
      PasswordRecoveryCommand,
      Promise<NotificationResult>
    >(new PasswordRecoveryCommand(passwordRecoveryDto.email));
  }

  //New password
  @ApiNewPassword()
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Post('new-password')
  async newPassword(
    @Body() inputDto: NewPasswordDto,
  ): Promise<NotificationResult> {
    return this.commandBus.execute<
      NewPasswordCommand,
      Promise<NotificationResult>
    >(new NewPasswordCommand(inputDto.newPassword, inputDto.recoveryCode));
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
    res.send(new SuccessResult());
  }

  //refreshToken
  @RefreshTokenRequired(RefreshTokenViewDto)
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
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res
      .status(200)
      .send(new SuccessResult({ accessToken: result.data.accessToken }));
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

  // @MeRequiredSwaggerDecorator()
  @ApiGetUserInfo(UserInfoViewDto)
  @UseGuards(JwtGuard)
  @Get('me')
  async getAuthInfo(
    @CurrentUser() userId: string,
  ): Promise<NotificationResult<UserInfoViewDto>> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      return NotificationResult.Failure(
        NotificationCodesEnum.NOT_FOUND,
        'user not found',
      );
    }
    return new SuccessResult(new UserInfoViewDto(user));
  }

  @ApiGetAuthSessions(AuthSessionViewDto)
  @UseGuards(JwtGuard)
  @Get('sessions')
  async getAuthSessions(@CurrentUser() userId: string) {
    return this.queryBus.execute(new GetAuthSessionsQuery(userId));
  }

  @ApiTerminateAllAuthSessions()
  @UseGuards(JwtCookieGuard)
  @Delete('sessions')
  async terminateSessions(
    @CurrentUser() userId: string,
    @DeviceMeta() deviceInfo: DeviceInfoType,
  ): Promise<NotificationResult> {
    await this.authRepository.deleteOtherAuthSession(
      userId,
      deviceInfo.deviceId,
    );
    return NotificationResult.Success();
  }

  @ApiTerminateAuthSession()
  @UseGuards(JwtCookieGuard)
  @Delete('session/:deviceId')
  async terminateSession(
    @CurrentUser() userId: string,
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
    @DeviceMeta() deviceInfo: DeviceInfoType,
  ): Promise<NotificationResult> {
    if (deviceInfo.deviceId === deviceId) {
      return NotificationResult.Failure(
        NotificationCodesEnum.FORBIDDEN,
        'You can not terminate active session',
        'auth sessions',
      );
    }
    return this.commandBus.execute(
      new KillAuthSessionCommand(userId, deviceId),
    );
  }
}
