import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { LogsModule } from './log/logs.module';
import { MongoModule } from './mongo';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './category copy/subcategory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    MongoModule,
    AuthModule,
    UserModule,
    BookmarkModule,
    LogsModule,
    CategoryModule,
    SubcategoryModule,
  ],
})
export class AppModule {}
