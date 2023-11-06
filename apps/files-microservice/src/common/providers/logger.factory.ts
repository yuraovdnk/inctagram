import {
  ConsoleTransportInstance,
  FileTransportInstance,
} from 'winston/lib/winston/transports';
import { format, transports } from 'winston';
import process from 'process';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities';
import { MongoDB } from 'winston-mongodb';

export const consoleTransport: ConsoleTransportInstance =
  new transports.Console({
    level: process.env.LOGS_CONSOLE_LEVEL ?? 'info',
    format: format.combine(
      format.timestamp(),
      format.ms(),
      nestWinstonModuleUtilities.format.nestLike('Files-Service', {
        colors: true,
        prettyPrint: true,
      }),
    ),
  });

const logsFolder = './logs/files-ms';
const logFileName = 'logs.log';
export const fileTransports: FileTransportInstance = new transports.File({
  level: process.env.LOGS_FILE_LEVEL ?? 'info',
  filename: `${logsFolder}/${logFileName}`,
  format: format.combine(format.timestamp(), format.json()),
  maxFiles: 10,
  maxsize: 5 * 1024 * 1024,
});

export const dbTransport = new MongoDB({
  db: process.env.MONGODB_URL,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  collection: 'logs-files-ms',
  level: process.env.LOGS_DB_LEVEL ?? 'warn',
  format: format.combine(
    format.timestamp(),
    format.metadata({
      fillWith: ['context'],
    }),
  ),
});
