import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductQueryParams, UpdateProductDto, CreateProductDto } from './dto';
import { CreateInventoryDto, CreateInventoryForProductDto } from '../inventory/dto';
import { JwtGuard } from '../auth/guard';
import { VendorGuard } from '../auth/guard/vendor.guard';
import { GetUser } from '../auth/decorator';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new product with inventory (requires vendorid in product data)' })
  @ApiBody({
    description: 'Product and inventory data - vendorid is REQUIRED in product object',
    examples: {
      example: {
        summary: 'Example product creation',
        value: {
          product: {
            vendorid: 2,
            name: 'Vim',
            price: 3.99,
            discountPrice: 1.99,
            description: 'Chemical cleaning agent',
            subcategory: [1],
            imageURL: ['https://example.com/vim.jpg'],
          },
          inventory: {
            stockQuantity: 420,
            restockDate: '2025-12-15T00:00:00Z',
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Product and inventory created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or missing vendorid',
  })
  create(
    @Body() body: { product: CreateProductDto; inventory: CreateInventoryForProductDto },
  ) {
    // Validate that vendorid is present in the request
    if (!body.product || !body.product.vendorid) {
      throw new Error('Vendor ID is required in product data');
    }
    return this.productService.create(body.product, body.inventory);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by product name (case insensitive contains)',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    description: 'Minimum price filter',
    type: Number,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    description: 'Maximum price filter',
    type: Number,
  })
  @ApiQuery({
    name: 'vendorId',
    required: false,
    description: 'Filter by vendor ID',
    type: Number,
  })
  @ApiQuery({
    name: 'subcategoryIds',
    required: false,
    description: 'Filter by subcategory IDs',
    type: [Number],
  })
  @ApiQuery({
    name: 'createdAfter',
    required: false,
    description: 'Filter products created after this date (ISO 8601 format)',
  })
  @ApiQuery({
    name: 'createdBefore',
    required: false,
    description: 'Filter products created before this date (ISO 8601 format)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (default: 10)',
    type: Number,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by (default: createdAt)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc or desc, default: desc)',
    enum: ['asc', 'desc'],
  })
  @ApiQuery({
    name: 'includeReviews',
    required: false,
    description: 'Include review statistics (average rating and total reviews)',
    type: Boolean,
  })
  @ApiQuery({
    name: 'minRating',
    required: false,
    description: 'Filter products by minimum average rating (1-5)',
    type: Number,
    minimum: 1,
    maximum: 5,
  })
  @ApiOkResponse({
    description: 'List of products',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          name: { type: 'string', example: 'Premium Coffee' },
          description: {
            type: 'string',
            example: 'High quality arabica coffee',
          },
          price: { type: 'number', example: 12.99 },
          discountPrice: { type: 'number', example: 10.99 },
          createdAt: { type: 'string', example: '2023-05-01T12:00:00Z' },
          updatedAt: { type: 'string', example: '2023-05-01T12:00:00Z' },
          imageURL: {
            type: 'array',
            items: { type: 'string' },
            example: ['https://example.com/image1.jpg'],
          },
          vendorid: { type: 'number', example: 1 },
          subcategory: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Beverages' },
                description: { type: 'string', example: 'Drinks category' },
              },
            },
          },
          Inventory: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '660e8400-e29b-41d4-a716-446655440000',
              },
              stockQuantity: { type: 'number', example: 100 },
              restockDate: { type: 'string', example: '2023-06-01T00:00:00Z' },
              updatedAt: { type: 'string', example: '2023-05-01T12:00:00Z' },
              productId: {
                type: 'string',
                example: '550e8400-e29b-41d4-a716-446655440000',
              },
            },
          },
          reviewStats: {
            type: 'object',
            properties: {
              averageRating: { type: 'number', example: 4.5 },
              totalReviews: { type: 'number', example: 12 },
            },
          },
        },
      },
    },
  })
  async findAll(@Query() query: ProductQueryParams = {}, @Query('includeReviews') includeReviews?: boolean) {
    return await this.productService.findAll(query, includeReviews);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total number of products' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved product count',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Total number of products'
        }
      }
    }
  })
  async count() {
    try {
      const count = await this.productService.count();
      return { count: count.count };
    } catch (error) {
      console.error('Error in product count:', error);
      return { count: 0 };
    }
  }

  // Vendor-specific endpoints
  @UseGuards(JwtGuard, VendorGuard)
  @Get('vendor/count')
  @ApiOperation({ summary: 'Get total number of products for current vendor' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved vendor product count',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Total number of products for the vendor'
        }
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Vendor access required' })
  async getVendorProductCount(@GetUser() user: { id: number }) {
    try {
      const count = await this.productService.countByVendor(user.id);
      return { count };
    } catch (error) {
      console.error('Error in vendor product count:', error);
      return { count: 0 };
    }
  }

  @UseGuards(JwtGuard, VendorGuard)
  @Get('vendor/products')
  @ApiOperation({ summary: 'Get all products for current vendor' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved vendor products'
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Vendor access required' })
  async getVendorProducts(@GetUser() user: { id: number }) {
    try {
      return await this.productService.findByVendor(user.id);
    } catch (error) {
      console.error('Error fetching vendor products:', error);
      return [];
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Product details',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        name: { type: 'string', example: 'Premium Coffee' },
        description: { type: 'string', example: 'High quality arabica coffee' },
        price: { type: 'number', example: 12.99 },
        discountPrice: { type: 'number', example: 10.99 },
        createdAt: { type: 'string', example: '2023-05-01T12:00:00Z' },
        updatedAt: { type: 'string', example: '2023-05-01T12:00:00Z' },
        imageURL: {
          type: 'array',
          items: { type: 'string' },
          example: ['https://example.com/image1.jpg'],
        },
        vendorid: { type: 'number', example: 1 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product and its inventory' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    description: 'Product update data',
    type: UpdateProductDto,
  })
  @ApiOkResponse({
    description: 'Product updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        name: { type: 'string', example: 'Updated Premium Coffee' },
        description: { type: 'string', example: 'Updated description' },
        price: { type: 'number', example: 14.99 },
        discountPrice: { type: 'number', example: 12.99 },
        createdAt: { type: 'string', example: '2023-05-01T12:00:00Z' },
        updatedAt: { type: 'string', example: '2023-05-02T12:00:00Z' },
        imageURL: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg',
          ],
        },
        vendorid: { type: 'number', example: 1 },
        subcategory: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Beverages' },
              description: { type: 'string', example: 'Drinks category' },
            },
          },
        },
        Inventory: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '660e8400-e29b-41d4-a716-446655440000',
            },
            stockQuantity: { type: 'number', example: 150 },
            restockDate: { type: 'string', example: '2023-06-15T00:00:00Z' },
            updatedAt: { type: 'string', example: '2023-05-02T12:00:00Z' },
            productId: {
              type: 'string',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Product deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        name: { type: 'string', example: 'Premium Coffee' },
        description: { type: 'string', example: 'High quality arabica coffee' },
        price: { type: 'number', example: 12.99 },
        discountPrice: { type: 'number', example: 10.99 },
        createdAt: { type: 'string', example: '2023-05-01T12:00:00Z' },
        updatedAt: { type: 'string', example: '2023-05-01T12:00:00Z' },
        imageURL: {
          type: 'array',
          items: { type: 'string' },
          example: ['https://example.com/image1.jpg'],
        },
        vendorid: { type: 'number', example: 1 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @UseGuards(JwtGuard, VendorGuard)
  @Post('vendor/test')
  @ApiOperation({ summary: 'Test endpoint for debugging product creation' })
  async testCreate(
    @Body() body: any,
    @GetUser() user: { id: number },
  ) {
    console.log('Test endpoint called');
    console.log('User ID:', user.id);
    console.log('Request body:', body);
    
    try {
      // Test the data structure
      const productWithVendor = {
        ...body.product,
        vendorid: user.id,
      };
      console.log('Product with vendor:', productWithVendor);
      
      return {
        message: 'Test successful',
        user: user.id,
        product: productWithVendor,
        inventory: body.inventory
      };
    } catch (error) {
      console.error('Test error:', error);
      throw error;
    }
  }

  @UseGuards(JwtGuard, VendorGuard)
  @Post('vendor/create')
  @ApiOperation({ summary: 'Create a new product for the authenticated vendor' })
  @ApiBody({
    description: 'Product and inventory data (vendor ID will be automatically set)',
    examples: {
      example: {
        summary: 'Example product creation for vendor',
        value: {
          product: {
            name: 'Vim',
            price: 3.99,
            discountPrice: 1.99,
            description: 'Chemical cleaning agent',
            subcategory: [1],
            imageURL: ['https://example.com/vim.jpg'],
          },
          inventory: {
            stockQuantity: 420,
            restockDate: '2025-12-15T00:00:00Z',
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Product and inventory created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  createForVendor(
    @Body() body: { product: Omit<CreateProductDto, 'vendorid'>; inventory: CreateInventoryForProductDto },
    @GetUser() user: { id: number },
  ) {
    // Automatically set the vendor ID from the authenticated user
    const productWithVendor = {
      ...body.product,
      vendorid: user.id,
    };
    return this.productService.create(productWithVendor, body.inventory);
  }
}
