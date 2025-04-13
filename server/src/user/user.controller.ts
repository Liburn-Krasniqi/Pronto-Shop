import { Controller, Get, UseGuards, Req, Post, Put, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { Delete } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private UserService: UserService) {}
    @Get('me')
    getme(@GetUser() user: User){
        return user
    }

    @Delete('me')
    deleteMe(@GetUser() user: User) {
    return this.UserService.deleteUser(user.id);
    }

    @Put('me')
    // @HttpCode(HttpStatus.OK)
    async updateProfile(
      @Body() updateData: UpdateUserDto,
      @Req() req: any 
    ) {
      const userId = req.user.id;
      
      console.log('Update data received from frontend:', updateData);
      const updatedUser = await this.UserService.updateUser(userId, updateData);
      
      return updatedUser;
    }
}
