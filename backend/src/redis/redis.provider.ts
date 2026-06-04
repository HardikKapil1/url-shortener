import Redis from 'ioredis';

export const redisProvider = {
  provide: 'REDIS',
  useFactory: () => {
    const redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    });
    return redis;
    },
};