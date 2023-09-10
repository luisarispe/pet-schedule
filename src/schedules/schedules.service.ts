import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { User } from 'src/auth/entities/user.entity';
import { Schedule } from './entities/schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetsService } from 'src/pets/pets.service';
import { SlackService } from 'nestjs-slack';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly petService: PetsService,
    private readonly slackService: SlackService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto, user: User) {
    await this.petService.findOne(createScheduleDto.idPet);

    const query = this.scheduleRepository.createQueryBuilder('schedule');
    const validateDate: [] = await query
      .select()
      .where(
        'schedule.dateStart >= :dateStart AND schedule.dateStart < :dateEnd',
        {
          dateStart: createScheduleDto.dateStart,
          dateEnd: createScheduleDto.dateEnd,
        },
      )
      .orWhere(
        'schedule.dateEnd > :dateStart AND schedule.dateEnd <= :dateEnd',
        {
          dateStart: createScheduleDto.dateStart,
          dataEnd: createScheduleDto.dateEnd,
        },
      )
      .execute();

    if (validateDate.length > 0)
      throw new BadRequestException(['la agenda ya esta ocupada']);

    try {
      const scheduleInsert = this.scheduleRepository.create({
        ...createScheduleDto,
        user,
      });
      await this.scheduleRepository.save(scheduleInsert);

      const schedule = await this.findOne(scheduleInsert.id);

      return schedule;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      const schedules = await this.scheduleRepository.find({
        order: {
          dateStart: 'ASC',
        },
      });
      return schedules;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    const schedule = await this.scheduleRepository.findOneBy({ id });
    if (!schedule) throw new BadRequestException(['la agenda no existe']);
    return schedule;
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    if (updateScheduleDto.idPet)
      await this.petService.findOne(updateScheduleDto.idPet);

    await this.validateUpdateDates(
      updateScheduleDto.dateStart,
      updateScheduleDto.dateEnd,
      id,
    );

    try {
      const scheduleInsert = await this.scheduleRepository.preload({
        id,
        ...updateScheduleDto,
      });

      await this.scheduleRepository.save(scheduleInsert);

      const schedule = await this.findOne(scheduleInsert.id);

      return schedule;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }

  private handleDBExceptions(error: any) {
    this.slackService.sendText(JSON.stringify(error));
    throw new InternalServerErrorException([
      'error inesperado, favor comunicarse con IT',
    ]);
  }

  private async validateUpdateDates(
    dateStart: Date,
    dateEnd: Date,
    id: string,
  ) {
    if (dateEnd || dateStart) {
      if (dateEnd === undefined || dateStart === undefined)
        throw new BadRequestException([
          'Debe agregar la fecha de inicio y final',
        ]);
      let validateDate: [] = [];

      const query = this.scheduleRepository.createQueryBuilder('schedule');
      validateDate = await query
        .select()
        .where(
          'schedule.dateStart >= :dateStart AND schedule.dateStart < :dateEnd',
          {
            dateStart: dateStart,
            dateEnd: dateEnd,
          },
        )
        .orWhere(
          'schedule.dateEnd > :dateStart AND schedule.dateEnd <= :dateEnd',
          {
            dateStart: dateStart,
            dataEnd: dateEnd,
          },
        )
        .having('id NOT IN (:...id)', { id: [id] })
        .execute();
      if (validateDate.length > 0)
        throw new BadRequestException(['la agenda ya esta ocupada']);
    }
  }
}
