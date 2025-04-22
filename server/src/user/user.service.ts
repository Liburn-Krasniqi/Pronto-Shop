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
      if (!updateData.currentPassword) {
        throw new Error('Current password is required');
      }
    
      const pwMatches = await argon.verify(user.hash, updateData.currentPassword);
      if (!pwMatches) {
        throw new Error('Current password is incorrect');
      }
    
      const updatePayload: any = {
        updatedAt: new Date(),
      };
    
      if (updateData.firstName) updatePayload.firstName = updateData.firstName;
      if (updateData.lastName) updatePayload.lastName = updateData.lastName;
      if (updateData.email) updatePayload.email = updateData.email;
    
      if (updateData.newPassword) {
        updatePayload.hash = await argon.hash(updateData.newPassword);
      }

      if (updateData.addresses) {
        return this.prisma.$transaction(async (tx) => {
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: updatePayload,
            });

            // Pass empty array if addresses is undefined
            await this.handleAddressUpdates(tx, userId, updateData.addresses ?? []);
            
            return updatedUser;
        });
      }
    
      return this.prisma.user.update({
        where: { id: userId },
        data: updatePayload,
      });
    }
    
    private async handleAddressUpdates(
      prisma: Prisma.TransactionClient,
      userId: number,
      addresses: UserAddressDto[]
    ) {
      // Get current addresses
      const currentAddresses = await prisma.userAddress.findMany({
          where: { userId }
      });
  
      // Determine addresses to delete
      const addressesToDelete = currentAddresses.filter(
          ca => !addresses.some(a => a.id === ca.id)
      );
  
      // Process deletions
      if (addressesToDelete.length > 0) {
          await prisma.userAddress.deleteMany({
              where: {
                  id: { in: addressesToDelete.map(a => a.id) }
              }
          });
      }
  
      // Process updates/creations
      await Promise.all(addresses.map(address => {
          if (address.id) {
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
          } else {
              return prisma.userAddress.create({
                  data: this.transformAddressData(address, userId)
              });
          }
      }));
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