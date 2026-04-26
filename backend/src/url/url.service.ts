// url.service.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Url } from './url.entity';
import { Click } from '../clicks/clicks.entity';
import { nanoid } from 'nanoid';
import Redis from 'ioredis';

@Injectable()
export class UrlService {
    constructor(
        @InjectRepository(Url)
        private urlRepo: Repository<Url>,
        @InjectRepository(Click)
        private clickRepo: Repository<Click>,
        @Inject('REDIS_CLIENT')
        private redis: Redis,

    ) { }

    async shorten(originalUrl: string) {
        for (let i = 0; i < 3; i++) {
            const shortCode = nanoid(8);
            const url = this.urlRepo.create({ originalUrl, shortCode });

            try {
                return await this.urlRepo.save(url);
            } catch (err: any) {
                if (err.code !== '23505') throw err; // unique violation
            }
        }

        throw new Error('Failed to generate unique short code');
    }

    /**
    * Redirects to the original URL based on the short code
    * @param shortCode
    * @param ip
    * @returns
    */

    async redirect(shortCode: string, ip: string) {
    // 1. Check cache
    const cached = await this.redis.get(`url:${shortCode}`);
    if (cached) {
        const parsed = JSON.parse(cached);

        this.trackClick(parsed.id, ip); // async
        return parsed;
    }

    // 2. DB
    const url = await this.urlRepo.findOne({
        where: { shortCode },
    });

    if (!url || !url.isActive || (url.expiresAt && url.expiresAt < new Date())) {
        throw new NotFoundException('URL not found or expired');
    }

    // 3. Cache it
    let ttl = 3600;

    if (url.expiresAt) {
        ttl = Math.max(
            Math.floor((url.expiresAt.getTime() - Date.now()) / 1000),
            1,
        );
    }

    await this.redis.set(`url:${shortCode}`, JSON.stringify(url), 'EX', ttl);

    this.trackClick(url.id, ip);

    return url;
}
    private trackClick(urlId: string, ip: string) {
    setImmediate(async () => {
        try {
            await this.clickRepo.save({
                url: { id: urlId },
                ipAddress: ip,
                clickedAt: new Date(),
            });
        } catch (err) {
            console.error('Click tracking failed', err);
        }
    });
}

    async getStats(shortCode: string) {
    const url = await this.urlRepo.findOne({
        where: { shortCode },
    });

    if (!url) throw new NotFoundException();

    return this.clickRepo
        .createQueryBuilder('click')
        .select('click.country', 'country')
        .addSelect('DATE(click.clickedAt)', 'date')
        .addSelect('COUNT(*)', 'count')
        .where('click.urlId = :urlId', { urlId: url.id })
        .groupBy('click.country')
        .addGroupBy('date')
        .getRawMany();
}
}