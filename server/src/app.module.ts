import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookmarkModule } from './bookmark/bookmark.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule, 
    MongooseModule.forRoot('mongodb://mongo:1234@localhost:27017/pronto-shop?authSource=admin'),
    AuthModule,
    UserModule, 
    BookmarkModule,
  ],
})
export class AppModule {}
