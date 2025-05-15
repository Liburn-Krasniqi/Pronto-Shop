import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto, ProductQueryParams } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInventoryDto } from '../inventory/dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, iDto: CreateInventoryDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Part One of the trensaction: Create the product
        const product = await tx.product.create({
          data: {
            name: dto.name,
            description: dto.description,
            price: dto.price,
            discountPrice: dto.discountPrice,
            vendorid: dto.vendorid,
            imageURL: dto.imageURL,
            subcategory: {
              connect: dto.subcategory.map((id) => ({ id })),
            },
          },
          include: {
            subcategory: true, // Include subcategories in the response
            Inventory: true, // Include inventory in the response
          },
        });
        //Part two: create the respective inventory
        const inventory = await tx.inventory.create({
          data: {
            productId: product.id,
            stockQuantity: iDto.stockQuantity, // or some default
            restockDate: iDto.restockDate, // or a default date
          },
        });
        return {
          ...product,
          Inventory: inventory,
        };
      });
    } catch (error) {
      // Proper error handling
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  findAll(query: ProductQueryParams = {}) {
    const where: any = {};

    // Name filter (case insensitive contains)
    if (query.name) {
      where.name = { contains: query.name, mode: 'insensitive' };
    }

    // Price range filter
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = query.minPrice;
      if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
    }

    // Vendor filter
    if (query.vendorId) {
      where.vendorid = query.vendorId;
    }

    // Subcategory filter
    if (query.subcategoryIds) {
      where.subcategory = {
        some: {
          id: {
            in: query.subcategoryIds,
          },
        },
      };
    }

    // Date range filter
    if (query.createdAfter || query.createdBefore) {
      where.createdAt = {};
      if (query.createdAfter)
        where.createdAt.gte = new Date(query.createdAfter);
      if (query.createdBefore)
        where.createdAt.lte = new Date(query.createdBefore);
    }

    const orderBy = {
      [query.sortBy as string]: query.sortOrder,
    };

    const skip = query.page ? (query.page - 1) * (query.limit || 10) : 0;

    return this.prisma.product.findMany({
      where,
      include: {
        subcategory: true,
        Inventory: true, // Include inventory if needed. Probably not.
      },
      skip,
      take: query.limit,
      orderBy,
    });
  }

  findOne(id: string) {
    return this.prisma.product.findFirst({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    return this.prisma.$transaction(async (tx) => {
      // Update product
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          discountPrice: dto.discountPrice,
          imageURL: dto.imageURL,
          vendorid: dto.vendorid,
          subcategory: dto.subcategory
            ? {
                set: dto.subcategory.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          subcategory: true,
          Inventory: true,
        },
      });

      // Update inventory if provided
      if (dto.inventory) {
        await tx.inventory.upsert({
          where: { productId: id },
          create: {
            productId: id,
            stockQuantity: dto.inventory.stockQuantity ?? 0,
            restockDate: dto.inventory.restockDate
              ? new Date(dto.inventory.restockDate)
              : null,
          },
          update: {
            stockQuantity: dto.inventory.stockQuantity,
            restockDate: dto.inventory.restockDate
              ? new Date(dto.inventory.restockDate)
              : null,
          },
        });
      }

      return updatedProduct;
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({
      where: {
        id: id,
      },
    });
  }
}
