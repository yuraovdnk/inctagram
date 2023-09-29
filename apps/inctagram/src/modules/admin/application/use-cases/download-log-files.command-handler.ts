import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SuccessResult } from '../../../../../../../libs/common/notification/notification-result';
import { Logger } from '@nestjs/common';
import fs from 'node:fs';
import process from 'process';

export class DownloadLogFilesCommand {}

@CommandHandler(DownloadLogFilesCommand)
export class DownloadLogFilesCommandHandler
  implements ICommandHandler<DownloadLogFilesCommand>
{
  async execute() {
    const logger = new Logger(DownloadLogFilesCommandHandler.name);
    try {
      const logsFolder = process.env.LOG_DIRECTORY ?? './logs';

      const readFile = async (fileName: string) => {
        return fs.promises.readFile(`${logsFolder}/${fileName}`);
      };
      const files = await fs.promises.readdir(logsFolder);
      const result: Buffer[] = [];
      if (files.length) {
        for (const fileName of files) {
          result.push(await readFile(fileName));
        }
      } else {
        logger.warn('No log files were read');
      }
      return new SuccessResult(result);
    } catch (e) {
      logger.error(e);
    }
  }
}
