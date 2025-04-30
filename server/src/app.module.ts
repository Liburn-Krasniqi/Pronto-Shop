import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { VendorModule } from './vendor/vendor.module';
import { LogsModule } from './log/logs.module';
import { MongoModule } from './mongo';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    MongoModule,
    AuthModule,
    UserModule,
    VendorModule,
    LogsModule,
    CategoryModule,
    SubcategoryModule,
  ],
})
export class AppModule {}
