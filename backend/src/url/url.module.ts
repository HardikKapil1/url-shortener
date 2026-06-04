import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { Url } from './url.entity';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Url]),
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
  ],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
