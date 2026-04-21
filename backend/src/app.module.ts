import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UrlModule } from './url/url.module';
import { Url } from './url/url.entity';
import { Click } from './clicks/clicks.entity';
import { AppController } from './app.controller';
import { RedisProvider } from './redis/redis.provider';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any) || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'url_shortener',
      entities: [Url, Click],
      synchronize: true,
    }),

   ThrottlerModule.forRoot({
  throttlers: [
    {
      ttl: 60,
      limit: 100,
    },
  ],
}),

    UrlModule, // ✅ now correctly inside imports
  ],
  controllers: [AppController],
  providers: [AppService, RedisProvider],
})
export class AppModule {}