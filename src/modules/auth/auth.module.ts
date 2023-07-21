import { Module } from '@nestjs/common';
import { AuthController } from './api/controllers/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthRepository } from './infrastructure/repository/auth.repository';

const commandHandlers = [];
const queryHandlers = [];
@Module({
  imports: [CqrsModule],
  controllers: [AuthController],
  providers: [...commandHandlers, ...queryHandlers, AuthRepository],
})
export class AuthModule {}
