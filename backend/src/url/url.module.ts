// src/url/url.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlService } from './url.service';
import { Url } from './url.entity';
import { UrlController } from './url.controller';
import { Click } from '../clicks/clicks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Url, Click]), UrlModule],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
