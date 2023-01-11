import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @MaxLength(100, {
    message: 'el nombre completo debe ser menor o igual a 100 caracteres',
  })
  @IsString({ message: 'el nombre completo debe ser una cadena de texto' })
  fullName: string;

  @IsString({ message: 'la contraseña debe ser una cadena de texto' })
  @MinLength(6, {
    message: 'la contraseña debe ser mayor o igual a 6 caracteres',
  })
  @MaxLength(100, {
    message: 'la contraseña debe ser menor o igual a 100 caracteres',
  })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener una letra mayúscula, minúscula y un número',
  })
  password: string;

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

  @IsOptional()
  @IsBoolean({ message: 'el estado del usuario debe ser un valor booleano' })
  isActive?: boolean;
}
