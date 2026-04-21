import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UrlModule } from './url/url.module';
import { Url } from './url/url.entity';
import { Click } from './clicks/clicks.entity';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'url_shortener',
      entities: [Url, Click],
      synchronize: true,
    }
  ), UrlModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
