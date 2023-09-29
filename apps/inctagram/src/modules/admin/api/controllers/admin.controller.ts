import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResult } from '../../../../../../../libs/common/notification/notification-result';

import { JwtGuard } from '../../../auth/application/strategies/jwt.strategy';
import { ApiGetAllLogFiles } from '../../application/swagger/api-get-all-log-files.swagger.decorator';
import { DownloadLogFilesCommand } from '../../application/use-cases/download-log-files.command-handler';
import { ReadLogFileCommand } from '../../application/use-cases/read-log-file.command-handler';
import { ApiReadLogFile } from '../../application/swagger/api-readl-log-file.swagger.decorator';

@ApiTags('Admin')
@ApiBearerAuth('accessToken')
@UseGuards(JwtGuard)
//TODO  @Roles(Role.Admin)
@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private commandBus: CommandBus) {}

  @ApiGetAllLogFiles()
  @HttpCode(HttpStatus.OK)
  @Get('/logs/download/all')
  async getAllLogFiles() {
    const result = await this.commandBus.execute(new DownloadLogFilesCommand());
    this.logger.log(result);
    return new SuccessResult(result);
  }

  @ApiReadLogFile()
  @HttpCode(HttpStatus.OK)
  @Get('/logs/read/:number')
  async readLogFile(@Param('number') number: number) {
    const result = await this.commandBus.execute(
      new ReadLogFileCommand(number),
    );
    return new SuccessResult(result);
  }
}
