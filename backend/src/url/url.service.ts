import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Url } from './url.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import Redis from 'ioredis';
import { Click } from '../clicks/clicks.entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepo: Repository<Url>,
    @Inject('REDIS')
    private redis: Redis,
    @InjectRepository(Click)
    private clickRepo: Repository<Click>,
  ) {}

  /**
   * Creates a short URL for the given original URL.
   * @param originalUrl The original URL to shorten.
   * @param expiresAt The date when the short URL should expire.
   * @returns A promise resolving to the created Url entity.
   */
  public async createShortUrl(
    originalUrl: string,
    expiresAt: string | undefined,
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
  public async redirect(shortCode: string, ip: string): Promise<string> {
    const cacheKey = `short:${shortCode}`;

    // 1. Check Cache
    try {
      const cachedData = await this.redis.get(cacheKey);
      if (cachedData) {
        const parsedUrl = JSON.parse(cachedData) as Url;
        setImmediate(() => {
          this.urlRepo.increment({ id: parsedUrl.id }, 'clickCount', 1);
          this.clickRepo.save({
            url: { id: parsedUrl.id } as Url,
            ipAddress: ip,
          });
        });
        return parsedUrl.originalUrl;
      }
    } catch {
      // Redis down — fall through to DB
    }

    // 2. Database Fallback
    const url = await this.urlRepo.findOne({ where: { shortCode } });

    if (!url || !url.isActive) {
      throw new NotFoundException('Short URL not found or inactive');
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new NotFoundException('Short URL has expired');
    }

    // 3. Save to Cache
    await this.redis.set(cacheKey, JSON.stringify(url), 'EX', 3600);

    // 4. Update click count
    url.clickCount += 1;
    await this.urlRepo.save(url);

    // 5. Record click
    setImmediate(() => {
      this.clickRepo.save({ url: { id: url.id } as Url, ipAddress: ip });
    });

    return url.originalUrl;
  }

  /**
   * Retrieves a Url entity by its short code.
   * @param shortCode The short code to look up.
   * @return A promise resolving to the Url entity if found, otherwise null.
   */
  public async getUrlByShortCode(shortCode: string): Promise<Url | null> {
    return this.urlRepo.findOne({ where: { shortCode } });
  }

  /**
   * Deactivates a short URL by its short code.
   * @param shortCode The short code of the URL to deactivate.
   * @return A promise that resolves when the URL has been deactivated.
   * @throws NotFoundException if the short URL does not exist.
   */
  public async deactivateShortUrl(shortCode: string): Promise<void> {
    const url = await this.urlRepo.findOne({ where: { shortCode } });
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }
    url.isActive = false;
    await this.urlRepo.save(url);
    await this.redis.del(`short:${shortCode}`); // Invalidate cache
  }

  public async getAll(page: number, limit: number) {
    const [data, total] = await this.urlRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }, // Show newest URLs first
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
