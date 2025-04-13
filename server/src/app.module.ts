import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ProductModule } from './product/product.module';
import { CheckoutModule } from './checkout/checkout.module';
import { OrderStatusModule } from './order_status/order_status.module';

@Module({
    imports: [
        // Load env variables globally
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        // Prisma for PostgreSQL
        PrismaModule,

        // Mongoose for MongoDB
        MongooseModule.forRootAsync({
            useFactory: async (config: ConfigService) => ({
                uri: config.get<string>('MONGODB_URI'),
            }),
            inject: [ConfigService],
        }),

        // Other feature modules
        AuthModule,
        UserModule,
        BookmarkModule,
        ProductModule,
        CheckoutModule,
        OrderStatusModule,
    ],
})
export class AppModule {}
