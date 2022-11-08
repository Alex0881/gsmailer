import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as bodyparser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    bodyparser.json({




        limit: '60mb',
    }),
  );
  // app.useLogger(app.get(Logger)); выводит информацию о старте приложения
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('Mailer service')
    .setDescription('For sending emails')
    .setVersion('1.0')
    .addTag('')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'token', // This name must match up with @ApiBearerAuth() in controller
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configEnv = app.get(ConfigService);
  const port = configEnv.get('PORT');

  await app.listen(port);
}
bootstrap();
