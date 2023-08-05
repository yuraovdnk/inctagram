import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { DeviceInfoType } from '../../../../../core/common/decorators/device-info.decorator';
import { AuthSessionEntity } from '../../../domain/entity/auth-session.entity';

export class CreateAuthSessionCommand {
  constructor(
    public readonly token: string,
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
  ) {}
  async execute(command: CreateAuthSessionCommand) {
    const decodedToken: any = this.jwtService.decode(command.token);
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
      return;
    }
    //refresh token regenerate

    authSession.refreshSession(command.deviceInfo.deviceId, timeToken);

    await this.authRepository.refreshAuthSession(
      command.deviceInfo.deviceId,
      authSession,
    );
  }
}
