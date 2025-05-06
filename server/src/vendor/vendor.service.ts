import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateVendorDto, UpdateVendorDto } from "./dto/";
import * as argon from 'argon2';
import { VendorAddressDto } from "./dto/vendorAddress.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class VendorService{
    constructor(private prisma: PrismaService){}

    async findAll() {
        return this.prisma.vendor.findMany({
          include: {
            addresses: true
          }
        });
    }

    // async signup(dto: CreateVendorDto) {
    //     const hash = await argon.hash(dto.password);
        
    //     try {
    //         return await this.prisma.$transaction(async (tx) => {

    //             const vendor = await tx.vendor.create({
    //                 data: {
    //                     email: dto.email,
    //                     hash,
    //                     name: dto.name,
    //                     businessName: dto.businessName,
    //                     phone_number: dto.phone_number
    //                 }
    //             });

    //             if (dto.address) {
    //                 await tx.vendorAddress.create({
    //                     data: this.transformVendorAddressData(dto.address, vendor.id)
    //                 });
    //             }

    //             return vendor;
    //         });
    //     } catch (error) {
    //         if (error.code === "P2002") {
    //             throw new ForbiddenException('Credentials taken');
    //         }
    //         throw error;
    //     }
    // }

    private transformVendorAddressData(address: VendorAddressDto, vendorId: number): Prisma.VendorAddressCreateInput {
        return {
            street: address.street,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            vendor: {
                connect: { id: vendorId }
            }
        };
    }

    async findById(id: number) {
        return this.prisma.vendor.findUnique({
          where: { id },
          include: {
            addresses: true
          }
        });
    }

    async update(vendorId: number, dto: UpdateVendorDto) {
        try {
            return await this.prisma.$transaction(async (tx) => {

                const updatedVendor = await tx.vendor.update({
                    where: { id: vendorId },
                    data: {
                        name: dto.name,
                        email: dto.email,
                        businessName: dto.businessName,
                        phone_number: dto.phone_number,
                        updatedAt: new Date()
                    }
                });
    

                if (dto.addresses) {
                    await this.handleVendorAddressUpdates(tx, vendorId, dto.addresses);
                }
    
                return updatedVendor;
            });
        } catch (error) {
            if (error.code === "P2002") {
                throw new ForbiddenException('Credentials taken');
            }
            throw error;
        }
    }
    
    private async handleVendorAddressUpdates(
        prisma: Prisma.TransactionClient,
        vendorId: number,
        address: VendorAddressDto
    ) {
        // Find existing address for this vendor
        const existingAddress = await prisma.vendorAddress.findFirst({
            where: { vendorId }
        });
    
        if (existingAddress) {
            // Update existing address
            return prisma.vendorAddress.update({
                where: { id: existingAddress.id },
                data: {
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    postalCode: address.postalCode,
                    country: address.country
                }
            });
        } else {
            // Create new address if none exists
            return prisma.vendorAddress.create({
                data: {
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    postalCode: address.postalCode,
                    country: address.country,
                    vendor: {
                        connect: { id: vendorId }
                    }
                }
            });
        }
    }

    async delete(vendorId: number) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                await tx.vendorAddress.deleteMany({
                    where: { vendorId }
                });
    
                return tx.vendor.delete({
                    where: { id: vendorId }
                });
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Vendor not found');
            }
            throw error;
        }
    }
}