// url.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UrlService } from './url.service';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  shorten(@Body() body: { originalUrl: string }) {}

  @Get(':code')
  redirect(@Param('code') code: string) {}
}