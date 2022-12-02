import { Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePetDto {
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  name: string;

  @IsIn(['feminino', 'masculino'])
  sex: string;

  @IsNumber()
  @Type(() => Number)
  age: number;

  @IsNumber()
  @Type(() => Number)
  idSpecies: number;
}
