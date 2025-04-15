import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateVendorDto, UpdateVendorDto } from "./dto/";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class VendorService{
    constructor(private prisma: PrismaService){}

    async findAll(){
        return this.prisma.vendor.findMany()
    }

    async signup(dto: CreateVendorDto) {  
        const hash = await argon.hash(dto.password);
    
        try {
          const vendor = await this.prisma.vendor.create({
            data: {
                email: dto.email,
                hash,
                name: dto.name,
                businessName: dto.businessName,
                phone_number: dto.phone_number,
                country: dto.country,
                city: dto.city,
                zipCode: dto.zipCode,
                street: dto.street,
                
            },
          });
    
          return vendor;
    
        } catch (error) {
          if (error.code === "P2002") {
            throw new ForbiddenException('Credentials taken');
          }
          throw error;
        }
    }

    async findById(id: number){
        return this.prisma.vendor.findUnique({where : {id}})
    }

    async update(id: number, dto: UpdateVendorDto){
        

        try{
            const updatedVendor = await this.prisma.vendor.update({
                where : {id},
                data : {
                    name: dto.name,
                    email: dto.email,
                    businessName: dto.businessName,
                    phone_number: dto.phone_number,
                    country: dto.country,
                    city: dto.city,
                    zipCode: dto.zipCode,
                    street: dto.street,
                }
            })
            return  updatedVendor;
        }catch(error){
            if(error.code === "P2002"){
            throw new ForbiddenException('Credentials taken');
            }
            throw error
        }
    }

    async delete(id: number){
        return this.prisma.vendor.delete({
            where : {id}
        })
    }
}