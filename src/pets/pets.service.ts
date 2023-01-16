import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { SlackService } from 'nestjs-slack';

import { S3Service } from 'src/common/services/s3/s3.service';
import { SpeciesService } from 'src/species/species.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Pet } from './entities/pet.entity';
import { User } from '../auth/entities/user.entity';
import { OwnersService } from 'src/owners/owners.service';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    private readonly speciesService: SpeciesService,
    private readonly ownerService: OwnersService,
    private readonly s3Service: S3Service,
    private readonly slackService: SlackService,
  ) {}

  async create(
    createPetDto: CreatePetDto,
    user: User,
    file?: Express.Multer.File,
  ) {
    await this.speciesService.findOne(createPetDto.idSpecies);
    await this.ownerService.findOne(createPetDto.idOwner);

    const existName = await this.findName(createPetDto.name);
    if (existName)
      throw new BadRequestException([
        `el nombre: "${createPetDto.name}" ya existe`,
      ]);

    try {
      //CARGA IMAGEN
      if (file) {
        const urlImage = await this.s3Service.upload(file, 'img-pets');
        createPetDto.urlImage = urlImage;
      }

      const petInsert = this.petRepository.create({ ...createPetDto, user });

      await this.petRepository.insert(petInsert);

      const petDB = await this.findOne(petInsert.id);

      return petDB;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
  async findName(name: string) {
    try {
      const pet = await this.petRepository.findOneBy({ name });
      return pet;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const {
        limit = 10,
        offset = 0,
        sortColum = 'pet.name',
        sortDirection = 'DESC',
        filter = '',
      } = paginationDto;

      //OTRA OPCIÓN DE HACERLOS
      // const order:OrderByCondition = Object.fromEntries([[name, direction]]);
      // console.log(order);
      // const [result, count] = await this.petRepository.findAndCount({
      //   take: limit,
      //   skip: offset,
      //   order: order,
      // });
      const [result, count] = await this.petRepository
        .createQueryBuilder('pet')
        .leftJoinAndSelect('pet.species', 'species')
        .leftJoinAndSelect('pet.owner', 'owner')
        .leftJoinAndSelect('owner.user', 'user userOwners')
        .leftJoinAndSelect('pet.user', 'user')
        .where('pet.name like :name', { name: `%${filter}%` })
        .orderBy({
          [sortColum]: sortDirection,
        })
        .take(limit)
        .skip(offset)
        .getManyAndCount();

      return {
        pets: result,
        count,
      };
    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    const pet = await this.petRepository.findOneBy({ id });
    if (!pet) throw new NotFoundException(['mascota no encontrada']);
    return pet;
  }

  async update(
    id: string,
    updatePetDto: UpdatePetDto,
    file?: Express.Multer.File,
  ) {
    await this.findOne(id);

    if (updatePetDto.idSpecies)
      await this.speciesService.findOne(updatePetDto.idSpecies);

    if (updatePetDto.idOwner)
      await this.ownerService.findOne(updatePetDto.idOwner);

    const existName = await this.petRepository.findOne({
      where: {
        id: Not(id),
        name: updatePetDto.name ? updatePetDto.name : '',
      },
    });

    if (existName)
      throw new BadRequestException([
        `el nombre: '${updatePetDto.name}' ya existe`,
      ]);

    try {
      //CARGA IMAGEN
      if (file) {
        const urlImage = await this.s3Service.upload(file, 'img-pets');

        updatePetDto.urlImage = urlImage;
      }

      const pet = await this.petRepository.preload({
        id,
        ...updatePetDto,
      });
      await this.petRepository.save(pet);

      const petDB = await this.findOne(pet.id);
      return petDB;
    } catch (error) {
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
    this.slackService.sendText(JSON.stringify(error));
    throw new InternalServerErrorException([
      'error inesperado, favor comunicarse con IT',
    ]);
  }
}
