import { Module } from '@nestjs/common';
import { UsersRepository } from './instrastructure/repository/users.repository';

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
  ],
  exports: [UsersRepository],
})
export class UserModule {}
