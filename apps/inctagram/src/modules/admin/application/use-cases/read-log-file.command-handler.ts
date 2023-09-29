import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BadResult,
  SuccessResult,
} from '../../../../../../../libs/common/notification/notification-result';
import { Logger } from '@nestjs/common';
import fs from 'node:fs';
import process from 'process';

export class ReadLogFileCommand {
  constructor(public number: number) {}
}

@CommandHandler(ReadLogFileCommand)
export class ReadLogFileCommandHandler
  implements ICommandHandler<ReadLogFileCommand>
{
  async execute({ number }: ReadLogFileCommand) {
    const logger = new Logger(ReadLogFileCommandHandler.name);
    const logsFolder = process.env.LOG_DIRECTORY ?? './logs';
    let logFileName = process.env.LOG_FILE_NAME ?? 'logs.log';
    if (number) logFileName += `.${number}`;

    const logFile = await fs.promises.readFile(
      `${logsFolder}/${logFileName}`,
      'utf8',
    );
    if (!logFile) {
      logger.warn('Log file has not read');
      return new BadResult('Log file has not read');
    }
    const cleanedLogData = logFile.trim();
    const logObjects = cleanedLogData
      .split('\n') // Разделите строки на отдельные записи
      .map((logEntry) => JSON.parse(logEntry));
    return new SuccessResult(logObjects);
  }
}
