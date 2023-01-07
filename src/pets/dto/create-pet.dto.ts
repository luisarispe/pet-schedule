import { Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePetDto {
  @IsString({ message: 'el nombre debe ser una cadena de texto' })
  @MinLength(4, { message: 'el nombre debe ser mayor o igual a 4 caracteres' })
  @MaxLength(100, {
    message: 'el nombre debe ser menor o igual a 100 caracteres',
  })
  name: string;

  @IsIn(['hembra', 'macho'], {
    message: 'sexo debe ser uno de los siguientes valores: hembra, macho',
  })
  sex: string;

  @IsNumber()
  @IsPositive({ message: 'la edad debe ser un número positivo' })
  @Type(() => Number)
  age: number;

  @IsNumber()
  @Type(() => Number)
  idSpecies: number;

  @IsOptional()
  @IsString({ message: 'la url de imagen debe ser una cadena de texto' })
  urlImage?: string;
}
