import { Module } from '@nestjs/common';
import { UsersRepository } from './instrastructure/repository/users.repository';
import { UserDomainService } from './domain/service/user.domain-service';
import { CreateUserProfileCommandHandler } from './application/use-cases/create-user-profile.command-handler';
import { UserController } from './api/controllers/user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateUserProfileCommandHandler } from './application/use-cases/update-user-profile.command-handler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UploadUserAvatarCommandHandler } from './application/use-cases/upload-user-avatar.command.handler';
import process from 'process';

const commandHandlers = [
  CreateUserProfileCommandHandler,
  UpdateUserProfileCommandHandler,
  UploadUserAvatarCommandHandler,
];
const queryHandlers = [];
const eventsHandler = [];
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FILES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.FILE_SERVICE_HOST,
          port: +process.env.FILE_SERVICE_PORT,
        },
      },
    ]),
    CqrsModule,
  ],
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
