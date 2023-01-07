import { IsEmail, IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'el correo electronico debe ser una cadena de texto' })
  @IsEmail({
    message: 'el correo electronico debe ser valido',
  })
  email: string;

  @IsString({ message: 'la contraseña debe ser una cadena de texto' })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener una letra mayúscula, minúscula y un número',
  })
  password: string;
}
