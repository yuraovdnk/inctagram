import { Module } from '@nestjs/common';
import { UsersRepository } from './instrastructure/repository/users.repository';
import { UserDomainService } from './domain/service/user.domain-service';
import { CreateUserProfileCommandHandler } from './application/use-cases/commands/create-user-profile.command-handler';
import { UserController } from './api/controllers/user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateUserProfileCommandHandler } from './application/use-cases/commands/update-user-profile.command-handler';
import { UploadUserAvatarCommandHandler } from './application/use-cases/commands/upload-user-avatar.command.handler';

const commandHandlers = [
  CreateUserProfileCommandHandler,
  UpdateUserProfileCommandHandler,
  UploadUserAvatarCommandHandler,
];
const queryHandlers = [];
const eventsHandler = [];
@Module({
  imports: [CqrsModule],
  providers: [
    ...eventsHandler,
    ...queryHandlers,
    ...commandHandlers,
    UsersRepository,
    UserDomainService,
  ],
  controllers: [UserController],
  exports: [UsersRepository, UserDomainService],
})
export class UserModule {}
