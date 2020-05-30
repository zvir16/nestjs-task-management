import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');
  const loggger = new Logger('bootstrap app');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || serverConfig.port;

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({
      origin: serverConfig.origin
    });
    loggger.log(`Accepting request from origin ${serverConfig.origin}`)
  }

  await app.listen(port);
  loggger.log(`App is running on port ${port}`)
  
}
bootstrap();
