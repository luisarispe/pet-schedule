import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Species } from './entities/species.entity';

@Module({
  controllers: [SpeciesController],
  providers: [SpeciesService],
  imports:[
    TypeOrmModule.forFeature([
      Species
    ])
  ],
  exports:[
    TypeOrmModule,
    SpeciesService
  ]
})
export class SpeciesModule {}
