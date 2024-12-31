import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: isDevelopment,
      // whitelist: true,
      skipUndefinedProperties: true,
    }),
  );
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(
    helmet({
      crossOriginEmbedderPolicy: !isDevelopment,
      contentSecurityPolicy: !isDevelopment,
    }),
  );

  await app.listen(process.env.PORT, () =>
    console.log(`Server started on port = ${process.env.PORT}`),
  );
}
bootstrap();
