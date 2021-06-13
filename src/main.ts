import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const options = {
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: [
      'Authorization',
      'Module',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'objectcd',
      'Content-Type',
      'UserId',
      'CompanyId',
      'OrganizationId',
      '*'
    ]
  };
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors(options);
  await app.listen(process.env.PORT || 6000);
}
bootstrap();
