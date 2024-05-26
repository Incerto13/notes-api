import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // app.enableCors({
  //   origin: [
  //     'http://localhost:3000/api',
  //     'http://54.242.227.79:3000/api',
  //     'http://solace.incertotech.com/api',
  //     '*',
  //   ],
  //   methods: ["GET", "POST", "DELETE", "PATCH"],
  //   credentials: true,
  // });

  var whitelist = ['http://localhost:8080', 'http://54.242.227.79:8080', 'http://solace.incertotech.com:8080'];
  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
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
