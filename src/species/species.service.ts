import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { SlackService } from 'nestjs-slack';

import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { Species } from './entities/species.entity';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
    private readonly slackService: SlackService,
  ) {}

  async create(createSpeciesDto: CreateSpeciesDto) {
    const nameExists = await this.speciesRepository.findOneBy({
      name: createSpeciesDto.name,
    });

    if (nameExists) {
      throw new BadRequestException([
        `La especie ${createSpeciesDto.name} ya esta registrada`,
      ]);
    }

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

    const existName = await this.speciesRepository.findOne({
      where: {
        id: Not(id),
        name: updateSpeciesDto.name ? updateSpeciesDto.name : '',
      },
    });

    if (existName)
      throw new BadRequestException(
        `La especie ${updateSpeciesDto.name} ya esta registrada`,
      );

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
    this.slackService.sendText(JSON.stringify(error));

    if (error.errno === 1451)
      throw new BadRequestException(
        'No se puede eliminar la especie, ya que esta asociada a una mascota',
      );
    throw new InternalServerErrorException(
      'error inesperado, favor comunicarse con IT',
    );
  }
}
