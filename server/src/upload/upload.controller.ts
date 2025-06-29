import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    return {
      message: 'File uploaded successfully',
      url: `/uploads/${file.filename}`,
    };
  }

  @Post('profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    return {
      message: 'Profile picture uploaded successfully',
      filePath: `/uploads/profile-pictures/${file.filename}`,
    };
  }
} 