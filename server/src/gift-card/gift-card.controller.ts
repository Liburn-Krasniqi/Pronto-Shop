import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GiftCardService } from './gift-card.service';
import { JwtGuard } from '../auth/guard/jwt-user.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { VendorGuard } from '../auth/guard/vendor.guard';
import { GetUser } from '../auth/decorator';

@ApiTags('Gift Cards')
@ApiBearerAuth()
@Controller('gift-cards')
export class GiftCardController {
  constructor(private giftCardService: GiftCardService) {}

  @Post('validate')
  @ApiOperation({ summary: 'Validate a gift card' })
  @ApiResponse({ status: 200, description: 'Gift card validated successfully' })
  @ApiResponse({ status: 404, description: 'Gift card not found' })
  @ApiResponse({ status: 400, description: 'Gift card is invalid or expired' })
  async validateGiftCard(@Body() body: { code: string }) {
    return this.giftCardService.validateGiftCard(body.code);
  }

  @Post('balance')
  @ApiOperation({ summary: 'Get gift card balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Gift card not found' })
  async getGiftCardBalance(@Body() body: { code: string }) {
    return this.giftCardService.getGiftCardBalance(body.code);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('admin')
  @ApiOperation({ summary: 'Create a new gift card (admin only)' })
  @ApiResponse({ status: 201, description: 'Gift card created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async createGiftCardAdmin(
    @Body() body: { code: string; amount: number; expiresAt?: string }
  ) {
    return this.giftCardService.createGiftCard(body);
  }

  @UseGuards(JwtGuard, VendorGuard)
  @Post('vendor')
  @ApiOperation({ summary: 'Create a new gift card (vendor only)' })
  @ApiResponse({ status: 201, description: 'Gift card created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Vendor access required' })
  async createGiftCardVendor(
    @Body() body: { code: string; amount: number; expiresAt?: string },
    @GetUser() user: { id: number }
  ) {
    return this.giftCardService.createGiftCard({
      ...body,
      vendorId: user.id
    });
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('admin')
  @ApiOperation({ summary: 'List all gift cards (admin only)' })
  @ApiResponse({ status: 200, description: 'List of gift cards' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async listGiftCardsAdmin() {
    return this.giftCardService.listGiftCards();
  }

  @UseGuards(JwtGuard, VendorGuard)
  @Get('vendor')
  @ApiOperation({ summary: 'List gift cards for current vendor' })
  @ApiResponse({ status: 200, description: 'List of vendor gift cards' })
  @ApiResponse({ status: 403, description: 'Forbidden - Vendor access required' })
  async listGiftCardsVendor(@GetUser() user: { id: number }) {
    return this.giftCardService.listGiftCardsByVendor(user.id);
  }
} 