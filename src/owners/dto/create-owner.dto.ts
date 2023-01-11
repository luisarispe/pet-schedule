import { Type } from 'class-transformer';
import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { CustomRutValidation } from 'src/common/validators/customRutValidation';

export class CreateOwnerDto {
  @IsString({ message: 'el nombre completo debe ser una cadena de texto' })
  @MinLength(4, {
    message: 'el nombre completo debe ser mayor o igual a 4 caracteres',
  })
  @MaxLength(100, {
    message: 'el nombre completo debe ser menor o igual a 100 caracteres',
  })
  fullName: string;

  @IsString({ message: 'el correo electronico debe ser una cadena de texto' })
  @IsEmail(
    {},
    {
      message: 'el correo electronico debe ser un correo electronico valido',
    },
  )
  @MaxLength(100, {
    message: 'el correo electronico debe ser menor o igual a 100 caracteres',
  })
  email: string;

  @Validate(CustomRutValidation)
  rut: string;

  @IsPhoneNumber(undefined, {
    message: 'el teléfono debe ser un número de teléfono válido',
  })
  phone: string;
}
