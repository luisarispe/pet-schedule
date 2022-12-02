import { Injectable } from '@nestjs/common';
import { PetsService } from 'src/pets/pets.service';
import { SpeciesService } from 'src/species/species.service';
import { dataPet, dataSpecies } from './data/seed-data';
@Injectable()
export class SeedService {
  constructor(
    private readonly petService: PetsService,
    private readonly speciesServices: SpeciesService,
  ) {}

  async executeSEED() {
    await this.petService.removeAll();
    await this.speciesServices.removeAll();

    const { id } = await this.speciesServices.create(dataSpecies);

    const idSpecies = id;
    const insPromisePets = [];
    dataPet.map((pet) => {
      insPromisePets.push(this.petService.create({ ...pet, idSpecies }));
    });

    await Promise.all(insPromisePets);
    return `Executed seed`;
  }
}
