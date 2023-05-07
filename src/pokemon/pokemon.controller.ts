import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('pokemon')
export class PokemonController {
  private readonly logger = new Logger(PokemonController.name);
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() createPokemonDto: CreatePokemonDto) {
    this.consoleLog(this.create, `New request`);
    const pokemon = await this.pokemonService.create(createPokemonDto);
    return { data: pokemon };
  }

  @Get()
  async findAll() {
    this.consoleLog(this.findAll, `New request`);
    const pokemons = await this.pokemonService.findAll();
    if (!pokemons) throw new NotFoundException('No data found');
    return { data: pokemons };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.consoleLog(this.findOne, `New request`);
    const pokemon = await this.pokemonService.findOne(id);
    if (!pokemon) throw new NotFoundException(`No data found for ${id}`);
    return { data: pokemon };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ) {
    this.consoleLog(this.update, `New request`);
    const pokemon = await this.pokemonService.update(id, updatePokemonDto);
    if (!pokemon) {
      throw new NotFoundException(`No data found for ${id}`);
    }
    return { data: pokemon };
  }

  @Delete(':id')
  async remove(@Param('id', ParseMongoIdPipe) id: string) {
    this.consoleLog(this.remove, `New request`);
    const answer = await this.pokemonService.remove(id);
    if (!answer) throw new NotFoundException(`No data found for ${id}`);
    return { message: `Value with _id: ${id} has been deleted` };
  }

  private consoleLog(method: any, text: any) {
    const { name } = method;
    return this.logger.log(`${name}: ${text}`);
  }
}
