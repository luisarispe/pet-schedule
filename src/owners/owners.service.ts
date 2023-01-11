import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Owner } from './entities/owner.entity';
import { Repository } from 'typeorm';
import { SlackService } from 'nestjs-slack';
import { User } from 'src/auth/entities/user.entity';
import { parsePhoneNumber } from 'libphonenumber-js';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
    private readonly slackService: SlackService,
  ) {}

  async create(createOwnerDto: CreateOwnerDto, user: User) {
    const emailExists = await this.findEmail(createOwnerDto.email);

    if (emailExists) {
      throw new BadRequestException([
        `El correo electronico ${createOwnerDto.email} ya existe`,
      ]);
    }

    try {
      const owner = this.ownerRepository.create({ ...createOwnerDto, user });
      await this.ownerRepository.save(owner);

      const { countryCallingCode, nationalNumber } = parsePhoneNumber(
        owner.phone,
      );

      return { ...owner, countryCallingCode, nationalNumber };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const {
        limit = 10,
        offset = 0,
        sortColum = 'owner.fullName',
        sortDirection = 'ASC',
        filter = '',
      } = paginationDto;
      const [result, count] = await this.ownerRepository
        .createQueryBuilder('owner')
        .leftJoinAndSelect('owner.user', 'user')
        .where('owner.fullName like :fullName', { fullName: `%${filter}%` })
        .orderBy({
          [sortColum]: sortDirection,
        })
        .take(limit)
        .skip(offset)
        .getManyAndCount();

      return {
        owners: result,
        count,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    const owner = await this.ownerRepository.findOneBy({ id });
    if (!owner) throw new NotFoundException(['El dueño no existe']);

    const { countryCallingCode, nationalNumber } = parsePhoneNumber(
      owner.phone,
    );

    return { ...owner, countryCallingCode, nationalNumber };
  }

  async update(id: string, updateOwnerDto: UpdateOwnerDto) {
    await this.findOne(id);

    if (updateOwnerDto.email) {
      const existEmail = await this.findEmail(updateOwnerDto.email);
      if (existEmail && existEmail.id !== id) {
        throw new BadRequestException([
          `El correo electronico ${updateOwnerDto.email} ya existe`,
        ]);
      }
    }

    try {
      const owner = await this.ownerRepository.preload({
        id,
        ...updateOwnerDto,
      });

      const { countryCallingCode, nationalNumber } = parsePhoneNumber(
        owner.phone,
      );

      const ownerDB = await this.findOne(id);

      return { ...ownerDB, countryCallingCode, nationalNumber };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const owner = await this.findOne(id);
    try {
      await this.ownerRepository.delete(id);
      return owner;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private async findEmail(email: string) {
    try {
      const user = await this.ownerRepository.findOne({
        where: { email },
      });
      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async removeAll() {
    const query = this.ownerRepository.createQueryBuilder('owner');
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
