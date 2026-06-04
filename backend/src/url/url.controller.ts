import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  NotFoundException,
  Ip,
  Query,
  Delete,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlDto } from './url.dto';
import type { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('URLs')
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  @ApiOperation({ summary: 'Create a short URL' })
  @ApiResponse({ status: 201, description: 'The short URL has been created.' })
  async createShortUrl(@Body() createUrlDto: UrlDto) {
    const { originalUrl, expiresAt } = createUrlDto;
    const url = await this.urlService.createShortUrl(originalUrl, expiresAt);
    return {
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      expiresAt: url.expiresAt,
    };
  }

  @Get(':shortCode/stats')
  @ApiOperation({ summary: 'Get statistics for a short URL' })
  @ApiResponse({ status: 200, description: 'Returns the stats for the URL.' })
  @ApiResponse({ status: 404, description: 'Short URL not found.' })
  async getStats(@Param('shortCode') shortCode: string) {
    const url = await this.urlService.getUrlByShortCode(shortCode);
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }
    return {
      clickCount: url.clickCount,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      isActive: url.isActive,
    };
  }
  @Get('urls') // Accessible via GET /urls?page=1&limit=10
  @ApiOperation({ summary: 'Get a paginated list of all short URLs' })
  @ApiResponse({
    status: 200,
    description: 'Returns a paginated list of URLs.',
  })
  async getAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.urlService.getAll(pageNumber, limitNumber);
  }

  @Get(':shortCode')
  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiResponse({ status: 302, description: 'Redirects to the original URL.' })
  @ApiResponse({ status: 404, description: 'Short URL not found or expired.' })
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
    @Ip() ip: string,
  ) {
    const originalUrl = await this.urlService.redirect(shortCode, ip);
    return res.redirect(HttpStatus.FOUND, originalUrl);
  }

  @Delete(':shortCode')
  @ApiOperation({ summary: 'Deactivate a short URL' })
  @ApiResponse({
    status: 200,
    description: 'Short URL deactivated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Short URL not found.' })
  async deactivate(@Param('shortCode') shortCode: string) {
    await this.urlService.deactivateShortUrl(shortCode);
    return { message: 'Short URL deactivated successfully' };
  }
}
