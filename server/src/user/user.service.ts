import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDto } from "./dto/updateUser.dto";
import * as argon from 'argon2';




@Injectable()
export class UserService{
    constructor(private prisma: PrismaService){}
    async deleteUser(userId: number) {
        return this.prisma.user.delete({
        where: { id: userId },
        }); 
    }

    async updateUser(userId: number, updateData: UpdateUserDto) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
    
      if (!user) {
        throw new Error('User not found');
      }
    
      // Check if CurrentPassword is provided
      if (!updateData.CurrentPassword) {
        throw new Error('Current password is required');
      }
    
      const pwMatches = await argon.verify(user.hash, updateData.CurrentPassword);
      if (!pwMatches) {
        throw new Error('Current password is incorrect');
      }
    
      const updatePayload: any = {
        updatedAt: new Date(),
      };
    
      if (updateData.firstName) updatePayload.firstName = updateData.firstName;
      if (updateData.lastName) updatePayload.lastName = updateData.lastName;
      if (updateData.email) updatePayload.email = updateData.email;
    
      if (updateData.NewPassword) {
        updatePayload.hash = await argon.hash(updateData.NewPassword);
      }
    
      return this.prisma.user.update({
        where: { id: userId },
        data: updatePayload,
      });
    }
    
}