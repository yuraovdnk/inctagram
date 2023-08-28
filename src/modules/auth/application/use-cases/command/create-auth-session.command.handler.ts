import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { DeviceInfoType } from '../../../../../core/common/decorators/device-info.decorator';
import { AuthSessionEntity } from '../../../domain/entity/auth-session.entity';
import { AuthService, JwtTokens } from '../../service/auth.service';
import {
  NotificationResult,
  SuccessResult,
} from '../../../../../core/common/notification/notification-result';

export class CreateAuthSessionCommand {
  constructor(
    public readonly deviceInfo: DeviceInfoType,
    public readonly userId: string,
  ) {}
}
@CommandHandler(CreateAuthSessionCommand)
export class CreateAuthSessionCommandHandler
  implements ICommandHandler<CreateAuthSessionCommand>
{
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}
  async execute(
    command: CreateAuthSessionCommand,
  ): Promise<NotificationResult<JwtTokens>> {
    const tokens = await this.authService.generateTokens(
      command.userId,
      command.deviceInfo.deviceId,
    );

    const decodedToken: any = this.jwtService.decode(tokens.refreshToken);
    const timeToken = {
      iat: new Date(decodedToken.iat * 1000),
      exp: new Date(decodedToken.exp * 1000),
    };

    const authSession = await this.authRepository.findAuthSessionByDeviceId(
      command.deviceInfo.deviceId,
    );

    if (!authSession) {
      const session = AuthSessionEntity.create(
        command.deviceInfo,
        command.userId,
        timeToken,
      );
      await this.authRepository.createAuthSession(session);
      return new SuccessResult(tokens);
    }

    authSession.refreshSession(command.deviceInfo.deviceId, timeToken);

    await this.authRepository.refreshAuthSession(
      command.deviceInfo.deviceId,
      authSession,
    );
    return new SuccessResult(tokens);
  }
}
