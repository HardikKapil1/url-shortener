import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlDto } from './url.dto';
import type { Response } from 'express';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async createShortUrl(@Body()createUrlDto: UrlDto) {
    const { originalUrl, expiresAt } = createUrlDto;
    const url = await this.urlService.createShortUrl(originalUrl, expiresAt);
    return {
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      expiresAt: url.expiresAt,
    };
  }

  @Get(':shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const originalUrl = await this.urlService.redirect(shortCode);
    return res.redirect(HttpStatus.FOUND, originalUrl);
  }
}
