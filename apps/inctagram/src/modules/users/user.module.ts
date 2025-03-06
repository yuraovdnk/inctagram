import { Module } from '@nestjs/common';
import { UsersRepository } from './instrastructure/repository/users.repository';
import { UserDomainService } from './domain/service/user.domain-service';
import { CreateUserProfileCommandHandler } from './application/use-cases/commands/create-user-profile.command-handler';
import { UserController } from './api/controllers/user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateUserProfileCommandHandler } from './application/use-cases/commands/update-user-profile.command-handler';
import { UploadUserAvatarCommandHandler } from './application/use-cases/commands/upload-user-avatar.command.handler';
import { DeleteAvatarCommandHandler } from './application/use-cases/commands/delete-avatar.command.handler';
import { AccountController } from './api/controllers/account.controller';
import { GetAccountPlansQueryHandler } from './application/use-cases/queries/get-account-plans.query-handler';
import { UpgradeAccountPlanCommandHandler } from './application/use-cases/commands/upgrade-plan.command-handler';

const commandHandlers = [
  CreateUserProfileCommandHandler,
  UpdateUserProfileCommandHandler,
  UploadUserAvatarCommandHandler,
  DeleteAvatarCommandHandler,
  UpgradeAccountPlanCommandHandler,
];
const queryHandlers = [];
const eventsHandler = [GetAccountPlansQueryHandler];
@Module({
  imports: [CqrsModule],
  providers: [
    ...eventsHandler,
    ...queryHandlers,
    ...commandHandlers,
    UsersRepository,
    UserDomainService,
  ],
  controllers: [UserController, AccountController],
  exports: [UsersRepository, UserDomainService],
})
export class UserModule {}
