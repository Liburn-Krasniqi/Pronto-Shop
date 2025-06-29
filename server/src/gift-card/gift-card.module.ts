import { Module } from '@nestjs/common';
import { GiftCardController } from './gift-card.controller';
import { GiftCardService } from './gift-card.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GiftCardController],
  providers: [GiftCardService],
  exports: [GiftCardService],
})
export class GiftCardModule {} 