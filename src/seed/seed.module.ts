import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PetsModule } from '../pets/pets.module';
import { SpeciesModule } from '../species/species.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [PetsModule, SpeciesModule, AuthModule],
})
export class SeedModule {}
