import { ForbiddenException, Injectable, NotFoundException, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateVendorDto, UpdateVendorDto } from "./dto/";
import * as argon from 'argon2';
import { VendorAddressDto } from "./dto/vendorAddress.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class VendorService{
    constructor(private prisma: PrismaService){}

    async create(dto: CreateVendorDto) {
        try {
            // Hash the password
            const hash = await argon.hash(dto.password);

            return await this.prisma.$transaction(async (tx) => {
                // Create the vendor
                const vendor = await tx.vendor.create({
                    data: {
                        email: dto.email,
                        name: dto.name,
                        businessName: dto.businessName,
                        phone_number: dto.phone_number,
                        hash,
                    },
                });

                // Create address if provided
                if (dto.address) {
                    await tx.vendorAddress.create({
                        data: this.transformVendorAddressData(dto.address, vendor.id),
                    });
                }

                // Return the created vendor with address
                return tx.vendor.findUnique({
                    where: { id: vendor.id },
                    include: {
                        addresses: true
                    }
                });
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ForbiddenException('Email already exists');
            }
            throw error;
        }
    }

    async findAll() {
        return this.prisma.vendor.findMany({
          include: {
            addresses: true
          }
        });
    }
    
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
        try {
            const vendor = await this.prisma.vendor.findUnique({
                where: { id: Number(id) },
                include: {
                    addresses: true
                }
            });
            
            if (!vendor) {
                throw new NotFoundException('Vendor not found');
            }
            
            return vendor;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Error finding vendor', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(vendorId: number, dto: UpdateVendorDto) {
        try {
            const passwordChanged = !!dto.password;
            
            return await this.prisma.$transaction(async (tx) => {
                // Prepare update data
                const updateData: any = {
                    name: dto.name,
                    email: dto.email,
                    businessName: dto.businessName,
                    phone_number: dto.phone_number,
                    profilePicture: dto.profilePicture,
                    updatedAt: new Date()
                };

                // Handle password update if provided
                if (dto.password) {
                    updateData.hash = await argon.hash(dto.password);
                }

                const updatedVendor = await tx.vendor.update({
                    where: { id: vendorId },
                    data: updateData
                });
    

                if (dto.addresses) {
                    await this.handleVendorAddressUpdates(tx, vendorId, dto.addresses);
                }
    
                return {
                    message: 'Vendor updated successfully',
                    vendor: updatedVendor
                };
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

    async count() {
        try {
            const count = await this.prisma.vendor.count();
            return { count };
        } catch (error) {
            console.error('Error counting vendors:', error);
            return { count: 0 };
        }
    }
}