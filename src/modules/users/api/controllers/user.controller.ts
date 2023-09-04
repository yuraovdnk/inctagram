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
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import {
  NotificationResult,
  SuccessResult,
} from '../../../../core/common/notification/notification-result';
import { UserProfileDto } from '../../application/dto/request/user-profile.dto';
import { ApiCreateUserProfile } from '../../application/swagger/api-create-user-profile.swagger.decorator';
import { UsersRepository } from '../../instrastructure/repository/users.repository';
import { CreateUserProfileCommand } from '../../application/use-cases/create-user-profile.command-handler';
import { UserProfileViewDto } from '../../application/dto/response/user-profile.view.dto';
import { JwtGuard } from '../../../../core/common/guards/jwt.guard';
import { ApiGetUserProfile } from '../../application/swagger/api-get-user-profile.swagger.decorator';
import { UpdateUserProfileCommand } from '../../application/use-cases/update-user-profile.command-handler';
import { CurrentUser } from '../../../../core/common/decorators/current-user.decorator';
import { ApiUpdateUserProfile } from '../../application/swagger/api-update-user-profile.swagger.decorator';

@ApiTags('Users')
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(
    private commandBus: CommandBus,
    private readonly usersRepository: UsersRepository,
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
    if (userId !== id) throw new ForbiddenException();
    await this.commandBus.execute(new UpdateUserProfileCommand(dto, id));
    return new SuccessResult();
  }

  //get user profile
  @ApiGetUserProfile(UserProfileViewDto)
  @HttpCode(HttpStatus.OK)
  @Get('profile/:id')
  async getProfile(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<NotificationResult> {
    if (userId !== id) throw new ForbiddenException();
    const user = await this.usersRepository.getUserProfile(id);
    return new SuccessResult(new UserProfileViewDto(user));
  }
}
