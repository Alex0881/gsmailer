import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GsuiteModule } from './email/gsuite/gsuite.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp:
        process.env.NODE_ENV === 'production'
          ? {
              redact: { paths: ['req'], remove: true }, // чтобы не логировать req
              transport: {
                target: 'pino/file',
                options: {
                  singleLine: true,
                  destination: path.join(
                    __dirname,
                    '..',
                    'logs',
                    'mail-service.log',
                  ),
                  append: true,
                },
              },
              autoLogging: false,
            }
          : {
              redact: { paths: ['req'], remove: true }, // чтобы не логировать req
              transport: {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  //ignore: 'pid,hostname,req' // важно писать без пробелов
                },
              },
              autoLogging: false,
            },
    }),
    GsuiteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
