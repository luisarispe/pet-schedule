import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetsService } from './pets.service';
import { CommonModule } from '../common/common.module';
import { SpeciesModule } from '../species/species.module';
import { Pet } from './entities/pet.entity';
import { PetsController } from './pets.controller';

@Module({
  controllers: [PetsController],
  providers: [PetsService],
  imports: [TypeOrmModule.forFeature([Pet]), SpeciesModule, CommonModule],
  exports: [PetsService],
})
export class PetsModule {}
