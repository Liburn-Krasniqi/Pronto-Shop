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
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Users')
@ApiBearerAuth() // adds "Authorize" button for JWT token
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private UserService: UserService,private prisma: PrismaService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile with address' })
  @ApiResponse({ status: 200, description: 'User data with address returned' })
  async getme(@GetUser() user: { id: number }) {
    return this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        addresses: {
          select: {
            id: true,
            street: true,
            city: true,
            state: true,
            postalCode: true,
            country: true
          }
        }
      }
    });
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
