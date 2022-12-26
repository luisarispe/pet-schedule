import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './services/s3/s3.service';
import { SlackModule } from 'nestjs-slack';

@Module({
  providers: [S3Service],
  exports: [S3Service, SlackModule],
  imports: [
    ConfigModule,
    SlackModule.forRoot({
      type: 'webhook',
      url: process.env.URL_HOOCK,
    }),
  ],
})
export class CommonModule {}
