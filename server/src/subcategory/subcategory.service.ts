import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateSubcategoryDto, UpdateSubcategoryDto} from "./dto";

@Injectable()
export class SubcategoryService{
    constructor (private prisma : PrismaService){}

    async findAll(){
        return this.prisma.subcategory.findMany(
            {
            include : {
                // products: true,
                category: true
            }
        }
        )
    }

    async findById(id: number){
        return this.prisma.subcategory.findUnique({
            where: {id},
            include: {
                // products: true,
                category: true
            }
        })
    }

    async create(dto: CreateSubcategoryDto){
        try{
            const subcategory = await this.prisma.subcategory.create({
                data: {
                    name: dto.name,
                    description: dto.description,
                    categoryId: dto.categoryId
                }
            })
            return subcategory;
        }catch(error){
            if(error.code == "P2002"){
                throw new ForbiddenException("Subcategory already exists");
            }
            throw error
        }
    }

    async update(id:number, dto: UpdateSubcategoryDto){
        try{
            const updatedSubcategory = this.prisma.subcategory.update({
                where: {id},
                data: {
                    name: dto.name,
                    description: dto.description,
                    categoryId: dto.categoryId,
                    updatedAt: new Date()
                }
            })
            return updatedSubcategory;
        }catch(error){
            if(error.code == "P2002"){
                throw new ForbiddenException("Subcategory already exists")
            }
            throw error;
        }
    }

    async delete(id:number){
        try{
            return this.prisma.subcategory.delete({
                where : {id}
            })
        }catch(error){
            if(error.code == "P2025"){
                throw new ForbiddenException("Subcategory doesn't exist");
            }
            throw error
        }
    }
}