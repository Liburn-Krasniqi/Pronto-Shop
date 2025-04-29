import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {CreateCategoryDto, UpdateCategoryDto} from './dto/';

@Injectable()
export class CategoryService{
    constructor(private prisma: PrismaService){}
        
        async findAll(){
            return this.prisma.category.findMany({
                include: {
                    subcategories: true
                }
            })
        } 
        
        async findById(id: number){
            return this.prisma.category.findUnique({
                where : {id},
                include : {
                    subcategories : true
                }
            })
        }

        async create(dto: CreateCategoryDto){
            try{
                const category = await this.prisma.category.create({
                    data: {
                        name : dto.name,
                        description : dto.description
                    }
                });
                return category 
            } catch(error){
                if(error.code == "P2002"){
                    throw new ForbiddenException('Category already exists');
                }
                throw error;
            }   
        }

        async update(id: number, dto: UpdateCategoryDto){
            try{
                const updatedCategory = await this.prisma.category.update({
                    where: {id},
                    data: {
                        name : dto.name,
                        description : dto.description,
                        updatedAt : new Date()
                    }
                })
                return updatedCategory
            }catch(error){
                if(error.code == "P2002"){
                    throw new ForbiddenException('Category already exists');
                }
                throw error;
            }
        }

        async delete(id:number){
            try{
                return this.prisma.category.delete({
                    where: {id}
                })
            }catch(error){
                if(error.code == "P2025"){
                    throw new ForbiddenException("Category doesn't exist");
                }
                throw error;
            }
        }
}