import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;

  @IsOptional()
  @IsString()
  sortColum?: string;

  @IsIn(['DESC', 'ASC'])
  @IsOptional()
  sortDirection?: 'DESC' | 'ASC';

  @IsOptional()
  @IsString()
  filter?: string;
}
