import { IsDateString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UrlDto {
  @ApiProperty({
    example: 'https://www.google.com',
    description: 'The original URL to shorten',
  })
  @IsUrl()
  originalUrl!: string;

  @ApiPropertyOptional({
    example: '2026-12-31T23:59:59Z',
    description: 'Optional expiration date',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
