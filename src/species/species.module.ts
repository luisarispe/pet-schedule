import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Species } from './entities/species.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [SpeciesController],
  providers: [SpeciesService],
  imports: [TypeOrmModule.forFeature([Species]), CommonModule],
  exports: [TypeOrmModule, SpeciesService],
})
export class SpeciesModule {}
