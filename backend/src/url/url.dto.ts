import { IsDateString, IsOptional, IsUrl } from 'class-validator';

export class UrlDto {
  @IsUrl()
  originalUrl!: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: Date;
}
