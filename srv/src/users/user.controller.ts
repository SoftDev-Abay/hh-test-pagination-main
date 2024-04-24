import { UserService } from './users.service';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import { UsersResponseDto } from './users.response.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    this.logger.log('Get all users with pagination');
    const paginationOptions = {
      page: Number(page),
      limit: Number(limit),
    };

    const { data, total } = await this.userService.findByPage(paginationOptions.page, paginationOptions.limit);

    const responseData = data.map((user) => UsersResponseDto.fromUsersEntity(user));
    return {
      data: responseData,
      total,
      page: paginationOptions.page,
      limit: paginationOptions.limit,
    };
  }
}
