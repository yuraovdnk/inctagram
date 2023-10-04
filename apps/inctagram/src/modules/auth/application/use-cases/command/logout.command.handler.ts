import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
export class LogoutCommand {}
@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  execute(command: LogoutCommand): Promise<any> {
    return Promise.resolve(undefined);
  }
}
