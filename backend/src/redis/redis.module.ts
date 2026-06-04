import { Module } from '@nestjs/common';
import { redisProvider } from './redis.provider';

@Module({
  providers: [redisProvider],
  exports: [redisProvider],  // exports so UrlModule can use it
})
export class RedisModule {}