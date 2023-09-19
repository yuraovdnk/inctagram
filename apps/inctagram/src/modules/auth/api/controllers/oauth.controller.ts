import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GithubGuard } from '../../application/strategies/github.strategy';
import { Response } from 'express';
import {
  DeviceInfoType,
  DeviceMeta,
} from '../../../../../../../libs/common/decorators/device-info.decorator';
import { CurrentExternalAccount } from '../../../../../../../libs/common/decorators/external-account.decorator';
import { AuthenticationByExternalAccountCommand } from '../../application/use-cases/command/authentication-by-external-account-command.handler';
import { NotificationResult } from '../../../../../../../libs/common/notification/notification-result';
import { UserEntity } from '../../../users/domain/entity/user.entity';
import { CreateAuthSessionCommand } from '../../application/use-cases/command/create-auth-session.command.handler';
import { CommandBus } from '@nestjs/cqrs';
import { JwtTokens } from '../../application/service/auth.service';
import { GoogleGuard } from '../../application/strategies/google.strategy';
import { OauthExternalAccountDto } from '../../application/dto/request/oauth-external-account.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthByExternalAccountResponseSwagger } from '../../application/dto/swagger/auth-by-external-account.response.swagger';

@ApiTags('AUTH')
@Controller('oauth')
export class OauthController {
  constructor(private commandBus: CommandBus) {}

  @Get('github')
  @UseGuards(GithubGuard)
  async githubSignup(@Req() req) {}

  @AuthByExternalAccountResponseSwagger()
  @Get('github/callback')
  @UseGuards(GithubGuard)
  async githubAuthCallback(
    @Res({ passthrough: true }) res: Response,
    @DeviceMeta() deviceInfo: DeviceInfoType,
    @CurrentExternalAccount() account: OauthExternalAccountDto,
  ) {
    const resultAuth = await this.commandBus.execute<
      AuthenticationByExternalAccountCommand,
      NotificationResult<UserEntity>
    >(new AuthenticationByExternalAccountCommand(account));

    if (!resultAuth.hasError()) {
      const resultCreateSession = await this.commandBus.execute<
        CreateAuthSessionCommand,
        NotificationResult<JwtTokens>
      >(new CreateAuthSessionCommand(deviceInfo, resultAuth.data.id));

      res.cookie('refreshToken', resultCreateSession.data.refreshToken, {
        // httpOnly: true,
        // secure: true,
      });
      res
        .status(200)
        .send({ accessToken: resultCreateSession.data.accessToken });
    }
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleSignup(@Req() req) {}

  @AuthByExternalAccountResponseSwagger()
  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleSignupRedirect(
    @Res() res,
    @DeviceMeta() deviceInfo: DeviceInfoType,
    @CurrentExternalAccount() account: OauthExternalAccountDto,
  ) {
    const resultAuth = await this.commandBus.execute<
      AuthenticationByExternalAccountCommand,
      NotificationResult<UserEntity>
    >(new AuthenticationByExternalAccountCommand(account));

    if (!resultAuth.hasError()) {
      const resultCreateSession = await this.commandBus.execute<
        CreateAuthSessionCommand,
        NotificationResult<JwtTokens>
      >(new CreateAuthSessionCommand(deviceInfo, resultAuth.data.id));

      res.cookie('refreshToken', resultCreateSession.data.refreshToken, {
        // httpOnly: true,
        // secure: true,
      });
      res
        .status(200)
        .send({ accessToken: resultCreateSession.data.accessToken });
    }
  }
}
