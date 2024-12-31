import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      skipUndefinedProperties: true,
    }),
  );
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(8080, () => console.log('Server started on port 8080'));
}
bootstrap();
