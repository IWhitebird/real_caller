import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationDTO {
  // @IsOptional()
  // @Transform(({ value }) => value.trim().split(' ').join(' | '))
  // @IsString()
  // search?: string = '';

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit: number = 10;
}
