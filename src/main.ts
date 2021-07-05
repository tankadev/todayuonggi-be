import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import admin from 'firebase-admin';
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
  // Set the config options
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceAccount = require("../homnaychonmongi-serviceKey.json");
  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://homnaychonmongi-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
  app.enableCors(options);
  await app.listen(process.env.PORT || 6000);
}
bootstrap();
