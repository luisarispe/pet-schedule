import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetsService } from './pets.service';
import { CommonModule } from '../common/common.module';
import { SpeciesModule } from '../species/species.module';
import { Pet } from './entities/pet.entity';
import { PetsController } from './pets.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PetsController],
  providers: [PetsService],
  imports: [
    TypeOrmModule.forFeature([Pet]),
    SpeciesModule,
    CommonModule,
    AuthModule,
  ],
  exports: [PetsService],
})
export class PetsModule {}
