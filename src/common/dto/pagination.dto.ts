import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsPositive()
  @Min(1)
  limit?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsPositive()
  offset?: number;
}
