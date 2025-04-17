import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Put,
  Body,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@ApiTags('Users')
@ApiBearerAuth() // adds "Authorize" button for JWT token
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private UserService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User data returned' })
  getme(@GetUser() user: User) {
    return user;
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete current user account' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  deleteMe(@GetUser() user: User) {
    return this.UserService.deleteUser(user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async updateProfile(
    @Body() updateData: UpdateUserDto,
    @Req() req: any
  ) {
    const userId = req.user.id;
    const updatedUser = await this.UserService.updateUser(userId, updateData);
    return updatedUser;
  }
}
