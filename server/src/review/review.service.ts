import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    try {
      return await this.prisma.review.create({ data: createReviewDto });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('You have already reviewed this product.');
      }
      throw error;
    }
  }

  async findAll(productId?: string) {
    if (productId) {
      return this.prisma.review.findMany({
        where: { productId },
        include: { user: { select: { firstName: true, lastName: true } } },
      });
    }
    return this.prisma.review.findMany({
      include: { user: { select: { firstName: true, lastName: true } } },
    });
  }

  async findOne(id: number) {
    return this.prisma.review.findUnique({
      where: { id },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    return this.prisma.review.update({ where: { id }, data: updateReviewDto });
  }

  async remove(id: number) {
    return this.prisma.review.delete({ where: { id } });
  }
} 