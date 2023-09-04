import { Module } from '@nestjs/common';
import { UsersRepository } from './instrastructure/repository/users.repository';
import { UserDomainService } from './domain/service/user.domain-service';
import { CreateUserProfileCommandHandler } from './application/use-cases/create-user-profile.command-handler';
import { UserController } from './api/controllers/user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateUserProfileCommandHandler } from './application/use-cases/update-user-profile.command-handler';

const commandHandlers = [
  CreateUserProfileCommandHandler,
  UpdateUserProfileCommandHandler,
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
