import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  NotificationResult,
  SuccessResult,
} from '../../../../../../../libs/common/notification/notification-result';
import { UserProfileDto } from '../../application/dto/request/user-profile.dto';
import { ApiCreateUserProfile } from '../../application/swagger/api-create-user-profile.swagger.decorator';
import { UsersRepository } from '../../instrastructure/repository/users.repository';
import { CreateUserProfileCommand } from '../../application/use-cases/commands/create-user-profile.command-handler';
import { UpdateUserProfileCommand } from '../../application/use-cases/commands/update-user-profile.command-handler';
import { CurrentUser } from '../../../../../../../libs/common/decorators/current-user.decorator';
import { ApiUpdateUserProfile } from '../../application/swagger/api-update-user-profile.swagger.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseUserAvatarPipe } from '../../../../../../../libs/common/validators/parse-user-avatar.pipe';
import { UploadUserAvatarCommand } from '../../application/use-cases/commands/upload-user-avatar.command.handler';
import { JwtGuard } from '../../../auth/application/strategies/jwt.strategy';
import { UserProfileViewDto } from '../../application/dto/response/user-profile.view.dto';
import { ApiGetUserProfile } from '../../application/swagger/api-get-user-profile.swagger.decorator';
import { NotificationCodesEnum } from '../../../../../../../libs/common/notification/notification-codes.enum';

@ApiTags('Users')
@ApiBearerAuth('accessToken')
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(
    private commandBus: CommandBus,
    private usersRepository: UsersRepository,
  ) {}

  //create user profile
  @ApiCreateUserProfile()
  @HttpCode(HttpStatus.OK)
  @Post('profile/:id')
  async createProfile(
    @Param('id') id: string,
    @Body() dto: UserProfileDto,
    @CurrentUser() userId: string,
  ): Promise<NotificationResult> {
    if (userId !== id) throw new ForbiddenException();
    await this.commandBus.execute(new CreateUserProfileCommand(dto, id));
    return new SuccessResult();
  }

  //update user profile
  @ApiUpdateUserProfile()
  @HttpCode(HttpStatus.OK)
  @Put('profile/:id')
  async updateProfile(
    @Param('id') id: string,
    @Body() dto: UserProfileDto,
    @CurrentUser() userId: string,
  ): Promise<NotificationResult> {
    if (userId !== id) {
      return NotificationResult.Failure(
        NotificationCodesEnum.FORBIDDEN,
        'you haven`t permission to update this profile',
      );
    }
    return this.commandBus.execute(new UpdateUserProfileCommand(dto, id));
  }

  //get user profile
  @ApiGetUserProfile(UserProfileViewDto)
  @HttpCode(HttpStatus.OK)
  @Get('profile/:id')
  async getProfile(
    @Param('id') id: string,
  ): Promise<NotificationResult<UserProfileViewDto>> {
    const user = await this.usersRepository.getUserProfile(id);
    if (!user) {
      return NotificationResult.Failure(
        NotificationCodesEnum.NOT_FOUND,
        'user or profile not found',
      );
    }
    return NotificationResult.Success(new UserProfileViewDto(user));
  }

  @UseGuards(JwtGuard)
  @Post('profile/avatar/upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async saveProfileAvatar(
    @CurrentUser() userId: string,
    @UploadedFile(new ParseUserAvatarPipe())
    file: Express.Multer.File,
  ): Promise<NotificationResult> {
    return this.commandBus.execute<UploadUserAvatarCommand, NotificationResult>(
      new UploadUserAvatarCommand(userId, file),
    );
  }
}
