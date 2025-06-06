import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
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
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductQueryParams, UpdateProductDto, CreateProductDto } from './dto';
import { CreateInventoryDto } from '../inventory/dto';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new product with inventory' })
  @ApiBody({
    description: 'Product and inventory data',
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
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  create(
    @Body() body: { product: CreateProductDto; inventory: CreateInventoryDto },
  ) {
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
        },
      },
    },
  })
  async findAll(@Query() query: ProductQueryParams = {}) {
    return await this.productService.findAll(query);
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
}
