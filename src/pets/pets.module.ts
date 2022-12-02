import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { SpeciesModule } from '../species/species.module';

@Module({
  controllers: [PetsController],
  providers: [PetsService],
  imports: [TypeOrmModule.forFeature([Pet]), SpeciesModule],
  exports: [PetsService],
})
export class PetsModule {}
