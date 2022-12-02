import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { Species } from './entities/species.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
  ) {}

  async create(createSpeciesDto: CreateSpeciesDto) {
    try {
      const species = await this.speciesRepository.save(createSpeciesDto);
      await this.speciesRepository.save(species);

      return species;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      const species = await this.speciesRepository.find();

      return species;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: number) {
    const species = await this.speciesRepository.findOneBy({ id });

    if (!species) throw new NotFoundException(`No exist species id ${id}`);
    return species;
  }

  async update(id: number, updateSpeciesDto: UpdateSpeciesDto) {
    await this.findOne(id);
    try {
      const species = await this.speciesRepository.preload({
        id,
        ...updateSpeciesDto,
      });

      await this.speciesRepository.save(species);
      return species;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const species = await this.findOne(id);
    try {
      await this.speciesRepository.delete(id);
      return species;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
  async removeAll() {
    const query = this.speciesRepository.createQueryBuilder('species');
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
