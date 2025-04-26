import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDto } from "./dto/updateUser.dto";
import * as argon from 'argon2';
import { Prisma } from "@prisma/client";
import { UserAddressDto } from "./dto/userAddress.dto";

@Injectable()
export class UserService{
    constructor(private prisma: PrismaService){}
    
    async deleteUser(userId: number) {
      // Using transactions to ensure atomic deletion
      return this.prisma.$transaction([
          // First delete related addresses
          this.prisma.userAddress.deleteMany({
              where: { userId }
          }),
          // Then delete the user
          this.prisma.user.delete({
              where: { id: userId }
          })
      ]);
    }

    async updateUser(userId: number, updateData: UpdateUserDto) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { addresses: true }
      });
    
      if (!user) {
        throw new Error('User not found');
      }
    
      // Check if CurrentPassword is provided
      // if (!updateData.currentPassword) {
      //   throw new Error('Current password is required');
      // }
    
      // const pwMatches = await argon.verify(user.hash, updateData.currentPassword);
      // if (!pwMatches) {
      //   throw new Error('Current password is incorrect');
      // }
    
      const updatePayload: any = {
        updatedAt: new Date(),
      };
    
      if (updateData.firstName) updatePayload.firstName = updateData.firstName;
      if (updateData.lastName) updatePayload.lastName = updateData.lastName;
      if (updateData.email) updatePayload.email = updateData.email;
    
      // if (updateData.newPassword) {
      //   updatePayload.hash = await argon.hash(updateData.newPassword);
      // }

      if (updateData.addresses) {
        return this.prisma.$transaction(async (tx) => {
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: updatePayload,
            });

            await this.handleAddressUpdate(tx, userId, updateData.addresses?? {});
            
            return updatedUser;
        });
      }
    
      return this.prisma.user.update({
        where: { id: userId },
        data: updatePayload,
      });
    }
    
    private async handleAddressUpdate(
      prisma: Prisma.TransactionClient,
      userId: number,
      address: UserAddressDto
    ) {
      // Get current address (assuming one-to-one relationship)
      const currentAddress = await prisma.userAddress.findFirst({
        where: { userId }
      });
    
      // Case 1: Updating existing address
      if (address.id) {
        if (!currentAddress) {
          throw new Error('No existing address found to update');
        }
    
        if (currentAddress.id !== address.id) {
          throw new Error('Address ID does not match existing address');
        }
    
        return prisma.userAddress.update({
          where: { id: address.id },
          data: {
            street: address.street,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country
          }
        });
      }
      
      // Case 2: Creating new address when none exists
      if (!currentAddress) {
        return prisma.userAddress.create({
          data: {
            street: address.street,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            user: { connect: { id: userId } }
          }
        });
      }
    
      // Case 3: Updating existing address without ID (full replace)
      return prisma.userAddress.update({
        where: { id: currentAddress.id },
        data: {
          street: address.street,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country
        }
      });
    }
  
    private transformAddressData(address: UserAddressDto, userId: number): Prisma.UserAddressCreateInput {
        return {
            street: address.street,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            user: {
                connect: { id: userId }
            }
        };
    }

    
}