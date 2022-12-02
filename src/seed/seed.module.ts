import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PetsModule } from '../pets/pets.module';
import { SpeciesModule } from '../species/species.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [PetsModule, SpeciesModule],
})
export class SeedModule {}
