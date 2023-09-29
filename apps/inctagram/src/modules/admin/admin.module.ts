import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminController } from './api/controllers/admin.controller';
import { DownloadLogFilesCommandHandler } from './application/use-cases/download-log-files.command-handler';
import { ReadLogFileCommandHandler } from './application/use-cases/read-log-file.command-handler';

const commandHandlers = [
  DownloadLogFilesCommandHandler,
  ReadLogFileCommandHandler,
];
const queryHandlers = [];
const eventsHandler = [];
@Module({
  imports: [CqrsModule],
  providers: [...eventsHandler, ...queryHandlers, ...commandHandlers],
  controllers: [AdminController],
  exports: [],
})
export class AdminModule {}
