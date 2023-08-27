import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { UsersRepository } from '../../../../users/instrastructure/repository/users.repository';
import { UserEntity } from '../../../../users/domain/entity/user.entity';
import { OauthExternalAccountDto } from '../../dto/request/oauth-external-account.dto';
import { ExternalAccountEntity } from '../../../../users/domain/entity/external-account.entity';
import { EmailService } from '../../../../../core/adapters/mailer/mail.service';
import {
  NotificationResult,
  SuccessResult,
} from '../../../../../core/common/notification/notification-result';
import { UserCreatedByExternalAccountEvent } from '../../../domain/events/user-created-by-external-account.event';
import crypto from 'crypto';
import { UserDomainService } from '../../../../users/domain/service/user.domain-service';
import { hashSync } from 'bcrypt';

export class AuthenticationByExternalAccountCommand {
  constructor(
    public readonly oauthExternalAccountDto: OauthExternalAccountDto,
  ) {}
}

@CommandHandler(AuthenticationByExternalAccountCommand)
export class AuthenticationByExternalAccountCommandHandler
  implements ICommandHandler<AuthenticationByExternalAccountCommand>
{
  constructor(
    private authRepository: AuthRepository,
    private usersRepository: UsersRepository,
    private emailService: EmailService,
    private userDomainService: UserDomainService,
    private eventBus: EventBus,
  ) {}
  async execute(
    command: AuthenticationByExternalAccountCommand,
  ): Promise<NotificationResult<UserEntity>> {
    let user = await this.usersRepository.findUserByProviderId(
      command.oauthExternalAccountDto.providerId,
    );

    if (user) return new SuccessResult(user);

    user = await this.usersRepository.findByEmail(
      command.oauthExternalAccountDto.email,
    );

    if (!user) {
      const uniqueUsername = await this.userDomainService.generateUsername(
        command.oauthExternalAccountDto,
      );
      user = UserEntity.create(
        uniqueUsername,
        command.oauthExternalAccountDto.email,
        hashSync(crypto.webcrypto.randomUUID(), 10),
        true,
      );

      await this.usersRepository.create(user);
      this.eventBus.publish(new UserCreatedByExternalAccountEvent(user));
    }

    const externalAccountEntity = new ExternalAccountEntity(
      command.oauthExternalAccountDto,
      user.id,
    );

    await this.usersRepository.saveExternalAccount(externalAccountEntity);

    return new SuccessResult(user);
  }
}
