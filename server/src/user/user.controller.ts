import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Put,
  Body,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  Patch,
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
import { CreateUserDto } from './dto/createUser.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { UserGuard } from 'src/auth/guard/user.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private UserService: UserService, private prisma: PrismaService) {}

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() createData: CreateUserDto) {
    try {
      const hash = await argon.hash(createData.password);
      
      const user = await this.prisma.user.create({
        data: {
          email: createData.email,
          hash,
          firstName: createData.firstName,
          lastName: createData.lastName,
          role: 'user',
          addresses: createData.addresses ? {
            create: {
              street: createData.addresses.street,
              city: createData.addresses.city,
              state: createData.addresses.state,
              postalCode: createData.addresses.postalCode,
              country: createData.addresses.country,
            }
          } : undefined
        },
        include: {
          addresses: true
        }
      });

      const { hash: _, ...result } = user;
      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard, UserGuard)
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

  @UseGuards(JwtGuard, AdminGuard)
  @Get('admin/me')
  @ApiOperation({ summary: 'Get current admin profile with address' })
  @ApiResponse({ status: 200, description: 'Admin data with address returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getAdminProfile(@GetUser() user: { id: number }) {
    const admin = await this.prisma.user.findUnique({
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

    if (!admin) {
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    }

    return admin;
  }

  @UseGuards(JwtGuard, UserGuard)
  @Delete('me')
  @ApiOperation({ summary: 'Delete current user account' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  deleteMe(@GetUser() user: User) {
    return this.UserService.deleteUser(user.id);
  }

  @UseGuards(JwtGuard, UserGuard)
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

  @UseGuards(JwtGuard, AdminGuard)
  @Get('count')
  @ApiOperation({ summary: 'Get total user count (Admin only)' })
  @ApiResponse({ status: 200, description: 'User count returned' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async count() {
    const count = await this.UserService.count();
    return { count };
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of users returned' })
  async getAllUsers() {
    return this.prisma.user.findMany({
      where: { role: 'user' },
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

  @UseGuards(JwtGuard, AdminGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User data returned' })
  async getUserById(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(id) },
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

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID (Admin only)' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async updateUserById(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDto
  ) {
    const userId = parseInt(id);
    const updatedUser = await this.UserService.updateUser(userId, updateData);
    return updatedUser;
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUserById(@Param('id') id: string) {
    const userId = parseInt(id);
    await this.UserService.deleteUser(userId);
    return { message: 'User deleted successfully' };
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Patch('admin/me')
  @ApiOperation({ summary: 'Update current admin profile' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Admin profile updated successfully' })
  async updateAdminProfile(
    @GetUser() user: { id: number },
    @Body() updateData: UpdateUserDto
  ) {
    const updatedUser = await this.UserService.updateUser(user.id, updateData);
    return updatedUser;
  }
}
