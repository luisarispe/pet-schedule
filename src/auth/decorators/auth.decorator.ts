import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const Auth = (...args: string[]) => {
  return applyDecorators(UseGuards(AuthGuard()));
};
