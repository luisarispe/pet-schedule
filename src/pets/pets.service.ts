import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Species } from '../species/entities/species.entity';
import { SpeciesService } from 'src/species/species.service';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    private readonly speciesService: SpeciesService,
  ) {}

  async create(createPetDto: CreatePetDto) {
    await this.speciesService.findOne(createPetDto.idSpecies);
    try {
      const petInsert = this.petRepository.create(createPetDto);
      await this.petRepository.insert(petInsert);

      const petDB = await this.findOne(petInsert.id);

      return petDB;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;

      const pets = await this.petRepository.find({
        take: limit,
        skip: offset,
      });
      return pets;
    } catch (error) {
      this.handleDBExceptions(error);
    }
    return `This action returns all pets`;
  }

  async findOne(id: string) {
    const pet = await this.petRepository.findOneBy({ id });
    if (!pet) throw new NotFoundException(`No exist pet id: ${id}`);

    return pet;
  }

  async update(id: string, updatePetDto: UpdatePetDto) {
    await this.findOne(id);

    if (updatePetDto.idSpecies)
      await this.speciesService.findOne(updatePetDto.idSpecies);

    try {
      const pet = await this.petRepository.preload({ id, ...updatePetDto });
      await this.petRepository.save(pet);

      const petDB = await this.findOne(pet.id);
      return petDB;
    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const pet = await this.findOne(id);
    try {
      await this.petRepository.delete(id);
      return pet;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async removeAll() {
    const query = this.petRepository.createQueryBuilder('pet');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
  private handleDBExceptions(error: any) {
    if (error.errno === 1062) {
      throw new BadRequestException(error.sqlMessage);
    }
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
