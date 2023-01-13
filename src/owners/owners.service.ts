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
import { Not, Repository } from 'typeorm';
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
    const rutExists = await this.findRut(createOwnerDto.rut);

    if (rutExists) {
      throw new BadRequestException([
        `El rut ${createOwnerDto.rut} ya esta registrado al propietario ${rutExists.fullName}`,
      ]);
    }

    if (emailExists) {
      throw new BadRequestException([
        `El correo electronico ${createOwnerDto.email} ya esta registrado al propietario ${emailExists.fullName}`,
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
        .orWhere('owner.rut like :rut', { rut: `%${filter}%` })
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

    const existEmail = await this.ownerRepository.findOne({
      where: {
        id: Not(id),
        email: updateOwnerDto.email ? updateOwnerDto.email : '',
      },
    });
    if (existEmail)
      throw new BadRequestException([
        `El correo electronico ${updateOwnerDto.email} ya esta registrado al propietario ${existEmail.fullName}`,
      ]);

    const existRut = await this.ownerRepository.findOne({
      where: {
        id: Not(id),
        rut: updateOwnerDto.rut ? updateOwnerDto.rut : '',
      },
    });
    if (existRut)
      throw new BadRequestException([
        `El rut ${updateOwnerDto.rut} ya esta registrado al propietario ${existRut.fullName}`,
      ]);

    try {
      const owner = await this.ownerRepository.preload({
        id,
        ...updateOwnerDto,
      });

      await this.ownerRepository.save(owner);

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

  private async findRut(rut: string) {
    try {
      const user = await this.ownerRepository.findOne({
        where: { rut },
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
