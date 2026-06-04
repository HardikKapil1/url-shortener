import { Injectable, NotFoundException } from '@nestjs/common';
import { Url } from './url.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepo: Repository<Url>,
  ) {}

  /**
   * Creates a short URL for the given original URL.
   * @param originalUrl The original URL to shorten.
   * @param expiresAt The date when the short URL should expire.
   * @returns A promise resolving to the created Url entity.
   */
  public async createShortUrl(
    originalUrl: string,
    expiresAt: Date | undefined,
  ): Promise<Url> {
    const shortCode = nanoid(8);
    const newUrl = this.urlRepo.create({
      originalUrl,
      shortCode,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: true,
    });
    return this.urlRepo.save(newUrl);
  }

  /**
   * Finds the original URL for a given short code and increments the click count.
   * @param shortCode The short code to look up.
   * @returns A promise resolving to the original URL if found and active, otherwise null.
   * */
  public async redirect(shortCode: string): Promise<string> {
    const url = await this.urlRepo.findOne({ where: { shortCode } });
    // 1. Does it exist?
    if (!url || !url.isActive) {
      throw new NotFoundException('Short URL not found or inactive');
    }

    // 2. Now url is guaranteed to exist, safe to access properties
    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new NotFoundException('Short URL has expired');
    }

    // 3. Valid — proceed
    url.clickCount += 1;
    await this.urlRepo.save(url);
    return url.originalUrl;
  }
}
