// url.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { Click } from '../clicks/clicks.entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepo: Repository<Url>,
    @InjectRepository(Click)
    private clickRepo: Repository<Click>,
  ) {
    
  }

  async shorten(originalUrl: string) {}
  async redirect(shortCode: string) {}
}