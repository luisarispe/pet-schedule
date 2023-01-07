import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SlackService } from 'nestjs-slack';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly slackService: SlackService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const emailExists = await this.findEmail(createUserDto.email);

    if (emailExists) {
      throw new BadRequestException([
        `El correo electronico ${createUserDto.email} ya existe`,
      ]);
    }
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    const user = this.userRepository.findBy({ id });
    if (!user) throw new NotFoundException(['usuario no encontrado']);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const emailExists = await this.findEmail(updateUserDto.email);

    if (emailExists && emailExists.id !== id) {
      throw new BadRequestException([
        `El correo electronico ${updateUserDto.email} ya existe`,
      ]);
    }
    try {
      const user = await this.userRepository.preload({ id, ...updateUserDto });
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      await this.userRepository.delete(id);
      return { message: 'usuario eliminado' };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async removeAll() {
    const query = this.userRepository.createQueryBuilder('user');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async login(loginDto: LoginDto) {
    const { password, email } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['email', 'password', 'id'],
    });
    if (!user)
      throw new UnauthorizedException(['Usuario/contraseña incorrecta']);

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(['Usuario/contraseña incorrecta']);

    return { ...user, token: this.getJwtToken({ id: user.id }) };
  }

  private async findEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private getJwtToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBExceptions(error: any) {
    this.slackService.sendText(`Error' + ${JSON.stringify(`"${error}"`)}`);
    throw new InternalServerErrorException([
      'error inesperado, favor comunicarse con IT',
    ]);
  }
}
