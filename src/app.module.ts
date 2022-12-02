import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoiValidationSchema } from './config/joi.validation';
import { PetsModule } from './pets/pets.module';
import { CommonModule } from './common/common.module';
import { SpeciesModule } from './species/species.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema:JoiValidationSchema
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    PetsModule,
    CommonModule,
    SpeciesModule,
    SeedModule,
  ],
})
export class AppModule {}
