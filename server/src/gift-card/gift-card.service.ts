import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class GiftCardService {
  constructor(private prisma: PrismaService) {}

  async validateGiftCard(code: string): Promise<any> {
    const giftCard = await this.prisma.giftCard.findUnique({
      where: { code },
    });

    if (!giftCard) {
      throw new NotFoundException('Gift card not found');
    }

    if (!giftCard.isActive) {
      throw new BadRequestException('Gift card is inactive');
    }

    if (giftCard.expiresAt && giftCard.expiresAt < new Date()) {
      throw new BadRequestException('Gift card has expired');
    }

    if (Number(giftCard.balance) <= 0) {
      throw new BadRequestException('Gift card has no remaining balance');
    }

    return {
      id: giftCard.id,
      code: giftCard.code,
      balance: Number(giftCard.balance),
      amount: Number(giftCard.amount),
    };
  }

  async applyGiftCardToOrder(
    giftCardId: string,
    orderId: number,
    amountToUse: number,
  ): Promise<any> {
    const giftCard = await this.prisma.giftCard.findUnique({
      where: { id: giftCardId },
    });

    if (!giftCard) {
      throw new NotFoundException('Gift card not found');
    }

    if (Number(giftCard.balance) < amountToUse) {
      throw new BadRequestException('Insufficient gift card balance');
    }

    // Create usage record
    const usage = await this.prisma.giftCardUsage.create({
      data: {
        giftCardId,
        orderId,
        amountUsed: new Decimal(amountToUse),
      },
    });

    // Update gift card balance
    const updatedGiftCard = await this.prisma.giftCard.update({
      where: { id: giftCardId },
      data: {
        balance: giftCard.balance.minus(amountToUse),
        isActive: Number(giftCard.balance.minus(amountToUse)) > 0,
      },
    });

    return {
      usage,
      remainingBalance: Number(updatedGiftCard.balance),
    };
  }

  async getGiftCardBalance(code: string): Promise<any> {
    const giftCard = await this.prisma.giftCard.findUnique({
      where: { code },
    });

    if (!giftCard) {
      throw new NotFoundException('Gift card not found');
    }

    return {
      balance: Number(giftCard.balance),
      isActive: giftCard.isActive,
      expiresAt: giftCard.expiresAt,
    };
  }

  async createGiftCard(data: { code: string; amount: number; expiresAt?: string; vendorId?: number }) {
    // Check if code already exists
    const existing = await this.prisma.giftCard.findUnique({ where: { code: data.code } });
    if (existing) {
      throw new BadRequestException('Gift card code already exists');
    }
    
    const created = await this.prisma.giftCard.create({
      data: {
        code: data.code,
        amount: data.amount,
        balance: data.amount,
        isActive: true,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        vendorId: data.vendorId || null, // null for admin-created, vendorId for vendor-created
      },
    });
    
    return {
      ...created,
      amount: Number(created.amount),
      balance: Number(created.balance),
    };
  }

  async listGiftCards() {
    const giftCards = await this.prisma.giftCard.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    // Convert Decimal values to numbers
    return giftCards.map(card => ({
      ...card,
      amount: Number(card.amount),
      balance: Number(card.balance),
    }));
  }

  async listGiftCardsByVendor(vendorId: number) {
    const giftCards = await this.prisma.giftCard.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
    });
    
    // Convert Decimal values to numbers
    return giftCards.map(card => ({
      ...card,
      amount: Number(card.amount),
      balance: Number(card.balance),
    }));
  }
} 