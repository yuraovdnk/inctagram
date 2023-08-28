import { BaseUseCase } from '../src/core/common/app/base.use-case';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailConfirmationEntity } from '../src/modules/auth/domain/entity/email-confirmation.entity';
import { SuccessResult } from '../src/core/common/notification/notification-result';
import { AuthRepository } from '../src/modules/auth/infrastructure/repository/auth.repository';
import { EmailService } from '../src/core/adapters/mailer/mail.service';
import { PrismaService } from '../src/core/adapters/database/prisma/prisma.service';
import { UserEntity } from '../src/modules/users/domain/entity/user.entity';
import { UsersRepository } from '../src/modules/users/instrastructure/repository/users.repository';

export class TestCaseCommand {
  constructor() {}
}

@CommandHandler(TestCaseCommand)
export class TestCaseHandler
  extends BaseUseCase<TestCaseCommand>
  implements ICommandHandler<TestCaseCommand>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService,
    protected prismaService: PrismaService,
  ) {
    super(prismaService);
  }
  protected async onExecute(message: TestCaseCommand) {
    const user = UserEntity.create('Username443', 'email@gmai.com', 'password');
    await this.usersRepository.create(user);

    const codeEntityRes = EmailConfirmationEntity.create(user.id);

    if (codeEntityRes.hasError()) {
      return codeEntityRes;
    }

    await Promise.all([
      this.authRepository.createEmailConfirmCode(
        codeEntityRes.data,
        this.prismaService,
      ),
      this.emailService.sendConfirmCode(
        user.username,
        user.email,
        codeEntityRes.data.code,
      ),
    ]);

    return new SuccessResult(user);
  }
}
