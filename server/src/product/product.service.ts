import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto, ProductQueryParams } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInventoryForProductDto } from '../inventory/dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, iDto: CreateInventoryForProductDto) {
    try {
      console.log('Received product DTO:', dto);
      console.log('Received inventory DTO:', iDto);
      
      // Validate that vendorid is present
      if (!dto.vendorid) {
        throw new Error('Vendor ID is required');
      }
      
      // Validate that vendorid is a valid number
      if (isNaN(Number(dto.vendorid))) {
        throw new Error('Vendor ID must be a valid number');
      }
      
      console.log('Starting transaction...');
      return await this.prisma.$transaction(async (tx) => {
        console.log('Creating product with data:', {
          name: dto.name,
          description: dto.description,
          price: dto.price.toString(),
          discountPrice: dto.discountPrice ? dto.discountPrice.toString() : null,
          vendorid: Number(dto.vendorid),
          imageURL: dto.imageURL,
          subcategory: dto.subcategory.map((id) => ({ id })),
          inventory: {
            stockQuantity: Number(iDto.stockQuantity),
            restockDate: iDto.restockDate ? new Date(iDto.restockDate) : null,
          }
        });
        
        // Create the product with inventory in a single transaction
        const product = await tx.product.create({
          data: {
            name: dto.name,
            description: dto.description,
            price: dto.price.toString(),
            discountPrice: dto.discountPrice ? dto.discountPrice.toString() : null,
            Vendor: {
              connect: { id: Number(dto.vendorid) }
            },
            imageURL: dto.imageURL,
            subcategory: {
              connect: dto.subcategory.map((id) => ({ id })),
            },
            Inventory: {
              create: {
                stockQuantity: Number(iDto.stockQuantity),
                restockDate: iDto.restockDate ? new Date(iDto.restockDate) : null,
              },
            },
          },
          include: {
            subcategory: true,
            Inventory: true,
            Vendor: true,
          },
        });
        
        console.log('Product created successfully:', product);
        return product;
      });
    } catch (error) {
      // Proper error handling
      console.error('Error creating product:', error);
      console.error('Error stack:', error.stack);
      if (error instanceof Error) {
        throw new Error(`Failed to create product: ${error.message}`);
      }
      throw new Error('Failed to create product');
    }
  }

  async findAll(query: ProductQueryParams = {}, includeReviews: boolean = false) {
    const where: any = {};

    // Name filter (case insensitive contains)
    if (query.name) {
      where.name = { contains: query.name, mode: 'insensitive' };
    }

    // Price range filter
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = query.minPrice.toString();
      if (query.maxPrice !== undefined) where.price.lte = query.maxPrice.toString();
    }

    // Vendor filter
    if (query.vendorId) {
      where.vendorid = query.vendorId;
    }

    // Subcategory filter
    if (query.subcategoryIds && query.subcategoryIds.length > 0) {
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
      [query.sortBy || 'createdAt']: query.sortOrder || 'desc',
    };

    const skip = query.page ? (query.page - 1) * (query.limit || 10) : 0;

    const result = await this.prisma.product.findMany({
      where,
      include: {
        subcategory: true,
        Inventory: true,
        Vendor: true,
        ...(includeReviews && {
          _count: {
            select: {
              reviews: true
            }
          }
        })
      },
      skip,
      take: query.limit || 10,
      orderBy,
    });

    // If reviews are requested, fetch review statistics
    if (includeReviews && result.length > 0) {
      const productIds = result.map(p => p.id);
      const reviewStats = await this.getReviewStatistics(productIds);
      
      // Merge review statistics with products
      let productsWithReviews = result.map(product => ({
        ...product,
        reviewStats: reviewStats[product.id] || { averageRating: 0, totalReviews: 0 }
      }));

      // Apply rating filter if specified
      if (query.minRating) {
        productsWithReviews = productsWithReviews.filter(product => 
          product.reviewStats && 
          product.reviewStats.totalReviews > 0 && 
          product.reviewStats.averageRating >= query.minRating!
        );
      }

      return productsWithReviews;
    }

    return result;
  }

  async getReviewStatistics(productIds: string[]) {
    const reviewStats = await this.prisma.review.groupBy({
      by: ['productId'],
      where: {
        productId: {
          in: productIds
        }
      },
      _count: {
        rating: true
      },
      _avg: {
        rating: true
      }
    });

    const statsMap: Record<string, { averageRating: number; totalReviews: number }> = {};
    
    reviewStats.forEach(stat => {
      statsMap[stat.productId] = {
        averageRating: stat._avg.rating || 0,
        totalReviews: stat._count.rating
      };
    });

    return statsMap;
  }

  findOne(id: string) {
    return this.prisma.product.findFirst({
      where: {
        id: id,
      },
      include: {
        subcategory: true,
        Inventory: true,
        Vendor: true,
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    try {
      return this.prisma.$transaction(async (tx) => {
        // Build update data object with only provided fields
        const updateData: any = {};
        
        if (dto.name !== undefined) updateData.name = dto.name;
        if (dto.description !== undefined) updateData.description = dto.description;
        if (dto.price !== undefined) updateData.price = dto.price;
        if (dto.discountPrice !== undefined) updateData.discountPrice = dto.discountPrice;
        if (dto.imageURL !== undefined) updateData.imageURL = dto.imageURL;
        if (dto.vendorid !== undefined) {
          updateData.Vendor = {
            connect: { id: Number(dto.vendorid) }
          };
        }
        if (dto.subcategory !== undefined) {
          updateData.subcategory = {
            set: dto.subcategory.map((id) => ({ id })),
          };
        }

        // Update product only if there are fields to update
        let updatedProduct;
        if (Object.keys(updateData).length > 0) {
          updatedProduct = await tx.product.update({
            where: { id },
            data: updateData,
            include: {
              subcategory: true,
              Inventory: true,
              Vendor: true,
            },
          });
        } else {
          // If no product fields to update, just fetch the current product
          updatedProduct = await tx.product.findUnique({
            where: { id },
            include: {
              subcategory: true,
              Inventory: true,
              Vendor: true,
            },
          });
        }

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
    } catch (error) {
      // Proper error handling
      console.error('Error update product:', error);
      throw new Error('Failed to update product');
    }
  }

  remove(id: string) {
    return this.prisma.product.delete({
      where: {
        id: id,
      },
    });
  }

  async count() {
    try {
      const count = await this.prisma.product.count();
      return { count };
    } catch (error) {
      console.error('Error counting products:', error);
      return { count: 0 };
    }
  }

  async countByVendor(vendorId: number) {
    try {
      const count = await this.prisma.product.count({
        where: {
          vendorid: vendorId,
        },
      });
      return count;
    } catch (error) {
      console.error('Error counting vendor products:', error);
      return 0;
    }
  }

  async findByVendor(vendorId: number) {
    try {
      return await this.prisma.product.findMany({
        where: {
          vendorid: vendorId,
        },
        include: {
          subcategory: true,
          Inventory: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error finding vendor products:', error);
      return [];
    }
  }
}
