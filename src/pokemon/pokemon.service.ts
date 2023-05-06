import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  private readonly logger = new Logger(PokemonService.name);

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokeModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    const method = this.create.name;
    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const pokemon = await this.pokeModel.create(createPokemonDto);
      this.logger.log(
        `${method}: A new pokemon has been added to database: ${pokemon}`,
      );
      return pokemon;
    } catch (error) {
      this.logger.error(`${method}: ${error}`);
      if (error.code == 11000) {
        throw new BadRequestException('Pokemon already exists');
      }
      throw new InternalServerErrorException(
        'There is an error, check server logs',
      );
    }
  }

  async findAll() {
    try {
      const pokemons = await this.pokeModel.find();
      return pokemons;
    } catch (error) {
      this.logger.error(`${this.findAll.name}: ${error}`);
      throw new Error(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
