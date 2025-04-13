import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDto } from "./dto/updateUser.dto";



@Injectable()
export class UserService{
    constructor(private prisma: PrismaService){}
    async deleteUser(userId: number) {
        return this.prisma.user.delete({
        where: { id: userId },
        }); 
    }

    async updateUser(userId: number, updateData: UpdateUserDto) {
        console.log(updateData)
        return this.prisma.user.update({
          where: { id: userId },
          data: {
            ...updateData,
            updatedAt: new Date(),
          },
        });
      }
}