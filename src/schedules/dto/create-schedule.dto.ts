import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { STATUS } from 'src/constants/status';

export class CreateScheduleDto {
  @IsString({ message: 'el título debe ser una cadena de texto' })
  @MinLength(4, { message: 'el título debe ser mayor o igual a 4 caracteres' })
  @MaxLength(100, {
    message: 'el título debe ser menor o igual a 100 caracteres',
  })
  title: string;

  @Length(19, 19, { message: 'la fecha de inicio debe ser de 19 caracteres' })
  @IsDateString({ message: 'la fecha de inicio debe ser de tipo fecha' })
  dateStart: Date;

  @IsDateString({}, { message: 'la fecha de fin debe ser de tipo fecha' })
  @Length(19, 19, { message: 'la fecha de fin debe ser de 19 caracteres' })
  dateEnd: Date;

  @IsNotEmpty({ message: 'status no puede estar vacío' })
  @IsEnum(STATUS, {
    message:
      'status debe ser uno de los siguientes valores: pendiente, realizado, cancelado',
  })
  status: string;

  @IsNotEmpty({ message: 'idPet no puede estar vacio' })
  @IsUUID(undefined, { message: 'idPet debe ser de tipo uuid' })
  idPet: string;
}
