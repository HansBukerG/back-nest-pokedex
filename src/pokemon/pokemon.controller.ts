import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  async create(@Body() createPokemonDto: CreatePokemonDto) {
    const pokemon = await this.pokemonService.create(createPokemonDto);
    return { data: pokemon };
  }

  @Get()
  async findAll() {
    const pokemons = await this.pokemonService.findAll();
    if (!pokemons) throw new NotFoundException('No data found');
    return { data: pokemons };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const pokemon = await this.pokemonService.findOne(id);
    if (!pokemon) throw new NotFoundException(`No data found for ${id}`);
    return { data: pokemon };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ) {
    const pokemon = await this.pokemonService.update(id, updatePokemonDto);
    if (!pokemon) {
      throw new NotFoundException(`No data found for ${id}`);
    }
    return { data: pokemon };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const answer = this.pokemonService.remove(id);
    if (!answer) throw new NotFoundException(`No data found for ${id}`);
    return { message: `Value with _id: ${id} has been deleted` };
  }
}
