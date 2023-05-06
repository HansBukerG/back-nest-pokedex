import { IsString, MinLength, IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreatePokemonDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  dni: number;

  @IsString()
  @MinLength(3)
  name: string;
}
