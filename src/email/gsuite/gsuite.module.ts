import { Module } from '@nestjs/common';
import { GsuiteController } from './gsuite.controller';
import { GsuiteService } from './gsuite.service';

@Module({
  controllers: [GsuiteController],
  providers: [GsuiteService],
})
export class GsuiteModule {}
