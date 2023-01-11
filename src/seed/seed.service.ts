import { Injectable } from '@nestjs/common';
import { PetsService } from 'src/pets/pets.service';
import { SpeciesService } from 'src/species/species.service';
import { dataPet, dataSpecies, dataUser, dataOwner } from './data/seed-data';
import { AuthService } from 'src/auth/auth.service';
import { OwnersService } from 'src/owners/owners.service';
@Injectable()
export class SeedService {
  constructor(
    private readonly petsService: PetsService,
    private readonly speciesServices: SpeciesService,
    private readonly authService: AuthService,
    private readonly ownersService: OwnersService,
  ) {}

  async executeSEED() {
    //REMOVE ALL DATA
    await this.ownersService.removeAll();
    await this.petsService.removeAll();
    await this.speciesServices.removeAll();
    await this.authService.removeAll();

    const { id } = await this.speciesServices.create(dataSpecies);
    const user = await this.authService.create(dataUser);
    await this.ownersService.create(dataOwner, user);

    const idSpecies = id;
    const insPromisePets = [];

    dataPet.map((pet) => {
      insPromisePets.push(this.petsService.create({ ...pet, idSpecies }, user));
    });

    await Promise.all(insPromisePets);
    return `Executed seed`;
  }
}
