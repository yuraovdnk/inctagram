import { Module } from '@nestjs/common';
import { UsersRepository } from './instrastructure/repository/users.repository';
import { UserMapper } from './instrastructure/user.mapper';

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
    UserMapper,
  ],
  exports: [UsersRepository],
})
export class UserModule {}
