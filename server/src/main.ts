import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Enable raw body for Stripe webhooks
  });

  // Enable CORS for all origins in development
  app.enableCors({
    origin: true, // Allow all origins
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${process.env.APP_NAME} API`)
    .setDescription('Auto-generated API docs')
    .setVersion('1.0')
    .build();

  SwaggerModule.setup(
    '/docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  await app.listen(3333);
}
bootstrap();
