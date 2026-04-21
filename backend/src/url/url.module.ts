// src/url/url.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlService } from './url.service';
import { Url } from './url.entity';
import { UrlController } from './url.controller';
import { Click } from '../clicks/clicks.entity';
 import { RedisProvider } from '../redis/redis.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Url, Click]), UrlModule],
  controllers: [UrlController],
  providers: [UrlService, RedisProvider],
})
export class UrlModule {}
