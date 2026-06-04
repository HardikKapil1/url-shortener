import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { UrlModule } from './url/url.module';
import { Url } from './url/url.entity';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { Click } from './clicks/clicks.entity';

@Module({
  imports: [
    UrlModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any) || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'url_shortener',
      synchronize: true,
      entities: [Url, Click],
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 100,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
