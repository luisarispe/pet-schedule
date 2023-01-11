import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { validate } from 'rut.js';

@ValidatorConstraint({ name: 'rut', async: false })
@Injectable()
export class CustomRutValidation implements ValidatorConstraintInterface {
  constructor() {}

  rutRegex = /^([0-9]+-[0-9kK])$/;

  validate(value: string): boolean | Promise<boolean> {
    if (this.rutRegex.test(value) && validate(value)) {
      return true;
    }
  }
  defaultMessage(): string {
    return 'El rut debe ser un rut valido, ejemplo: 12345678-9';
  }
}
