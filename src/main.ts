import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  var whitelist = ['http://localhost', 'http://localhost:8080', 'https://solace.incertotech.com', 'http://solace.incertotech.com:8080'];
  app.enableCors({
    origin: function (origin, callback) {
      // if origin is undefined, then the call is coming from same origin and wasn't 
      // picked up by cors at all (i.e. under same dns name as api thus must be in prod)
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        console.log("allowed cors for:", origin)
        callback(null, true)
      } else {
        console.log("blocked cors for:", origin)
        callback(new Error('Not allowed by CORS'))
      }
    },
    allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: "GET,PATCH,POST,DELETE,UPDATE,OPTIONS",
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const port = 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`)
}
bootstrap();
