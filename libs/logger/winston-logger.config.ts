import { utilities as nestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities';
import { WinstonModuleOptions } from 'nest-winston';
import process from 'process';
import {
  ConsoleTransportInstance,
  FileTransportInstance,
} from 'winston/lib/winston/transports';
import { format, transports } from 'winston';
import * as Transport from 'winston-transport';
import { MongoDB } from 'winston-mongodb';

export const consoleTransport: ConsoleTransportInstance =
  new transports.Console({
    level: process.env.LOGS_CONSOLE_LEVEL ?? 'info',
    format: format.combine(
      format.timestamp(),
      format.ms(),
      nestWinstonModuleUtilities.format.nestLike('InctagarmAPI', {
        colors: true,
        prettyPrint: true,
      }),
    ),
  });

const logsFolder = process.env.LOG_DIRECTORY ?? './logs';
const logFileName = process.env.LOG_FILE_NAME ?? 'logs.log';
const fileTransports: FileTransportInstance = new transports.File({
  level: process.env.LOGS_FILE_LEVEL ?? 'info',
  filename: `${logsFolder}/${logFileName}`,
  format: format.combine(format.timestamp(), format.json()),
  maxFiles: 10,
  maxsize: 5 * 1024 * 1024, // 5 МБ
});

const dbTransport = new MongoDB({
  db: process.env.MONGODB_URL,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  collection: 'logs',
  level: process.env.LOGS_DB_LEVEL ?? 'warn',
  format: format.combine(
    format.timestamp(),
    format.metadata({
      fillWith: ['context'],
    }),
  ),
});

const logTransports: Transport[] = [dbTransport];

if (process.env.NODE_ENV !== 'production') {
  logTransports.push(consoleTransport);
  logTransports.push(fileTransports);
}
export const winstonOptions: WinstonModuleOptions = {
  level: 'info',
  transports: [...logTransports],
};
