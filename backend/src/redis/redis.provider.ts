import Redis from 'ioredis';

export const RedisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    const client = new Redis({
      host: 'localhost',
      port: 6379,
    });

    client.on('error', (err) => {
      console.error('Redis error:', err.message);
    });

    return client;
  },
};