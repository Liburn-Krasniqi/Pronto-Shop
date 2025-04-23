import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubcategoryDto ,UpdateSubcategoryDto } from './dto';


@Injectable()
export class SubcategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSubcategoryDto) {
    return this.prisma.subcategory.create({ data });
  }

  async findAll() {
    return this.prisma.subcategory.findMany({ include: { category: true } });
  }

  async findById(id: string) {
    return this.prisma.subcategory.findUnique({ where: { id }, include: { category: true } });
  }

  async update(id:string, data: UpdateSubcategoryDto) {
    return this.prisma.subcategory.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.subcategory.delete({ where: { id } });
  }
}
