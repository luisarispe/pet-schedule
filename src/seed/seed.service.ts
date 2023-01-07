import { Injectable } from '@nestjs/common';
import { PetsService } from 'src/pets/pets.service';
import { SpeciesService } from 'src/species/species.service';
import { dataPet, dataSpecies, dataUser } from './data/seed-data';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class SeedService {
  constructor(
    private readonly petService: PetsService,
    private readonly speciesServices: SpeciesService,
    private readonly authService: AuthService,
  ) {}

  async executeSEED() {
    //REMOVE ALL DATA
    await this.petService.removeAll();
    await this.speciesServices.removeAll();
    await this.authService.removeAll();

    const { id } = await this.speciesServices.create(dataSpecies);
    const user = await this.authService.create(dataUser);

    const idSpecies = id;
    const insPromisePets = [];

    dataPet.map((pet) => {
      insPromisePets.push(this.petService.create({ ...pet, idSpecies }, user));
    });

    await Promise.all(insPromisePets);
    return `Executed seed`;
  }
}
