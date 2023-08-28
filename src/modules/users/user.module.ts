import { Module } from '@nestjs/common';
import { UsersRepository } from './instrastructure/repository/users.repository';
import { UserDomainService } from './domain/service/user.domain-service';

const commandHandlers = [];
const queryHandlers = [];
const eventsHandler = [];
@Module({
  imports: [],
  providers: [
    ...eventsHandler,
    ...queryHandlers,
    ...commandHandlers,
    UsersRepository,
    UserDomainService,
  ],
  exports: [UsersRepository, UserDomainService],
})
export class UserModule {}
