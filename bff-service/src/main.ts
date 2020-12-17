import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { config } from 'dotenv';

import { AppModule } from './app.module';

config();

const port = process.env.PORT || 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.listen(port);
}
bootstrap().then(() => {
  console.log('App is running on %s port successfully', port);
});
