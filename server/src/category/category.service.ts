import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto ,UpdateCategoryDto } from './dto';


@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    return this.prisma.category.create({ data });
  }

  async findAll() {
    return this.prisma.category.findMany({ include: { subcategories: true } });
  }

  async findById(id: string) {
    return this.prisma.category.findUnique({ where: { id }, include: { subcategories: true } });
  }

  async update(id:string, data: UpdateCategoryDto) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
