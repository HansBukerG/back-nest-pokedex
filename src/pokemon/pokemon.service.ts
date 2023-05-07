import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception';
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
        `${method}: A new pokemon has been added to database: ${pokemon._id}`,
      );
      return pokemon;
    } catch (error) {
      this.logger.warn(`${method}: ${error}`);
      if (error.code == 11000) {
        throw new BadRequestException('Pokemon already exists');
      }
      throw new InternalServerErrorException(
        'There is an error, check server logs',
      );
    }
  }

  async findAll(): Promise<Pokemon[] | null> {
    const method = this.findAll.name;
    try {
      const pokemons = await this.pokeModel.find();
      if (pokemons.length === 0) return null;
      return pokemons;
    } catch (error) {
      this.logger.error(`${method}: ${error}`);
      throw new InternalServerErrorException(
        'There is an error, check server logs',
      );
    }
  }

  async findOne(name: string): Promise<Pokemon | null> {
    const method = this.findOne.name;
    try {
      const pokemon = await this.pokeModel.findOne({
        name,
      });
      return pokemon || null;
    } catch (error) {
      this.logger.error(`${method}: ${error}`);
      throw new InternalServerErrorException(
        'There is an error, check server logs',
      );
    }
  }

  async findById(_id: string): Promise<Pokemon | null> {
    const method = this.findOne.name;
    try {
      const pokemon = await this.pokeModel.findOne({
        _id,
      });
      return pokemon || null;
    } catch (error) {
      this.logger.error(`${method}: ${error}`);
      throw new InternalServerErrorException(
        'There is an error, check server logs',
      );
    }
  }

  async update(
    _id: string,
    updatePokemonDto: UpdatePokemonDto,
  ): Promise<Pokemon | null> {
    const method = this.update.name;
    try {
      const pokemon = await this.pokeModel.findByIdAndUpdate(
        _id,
        updatePokemonDto,
        {
          new: true,
        },
      );
      if (!pokemon) {
        return null;
      }
      return pokemon;
    } catch (error) {
      this.logger.error(`${method}: ${error}`);
      throw new InternalServerErrorException(
        'There is an error, check server logs',
      );
    }
  }

  async remove(_id: string): Promise<boolean> {
    const method = this.remove.name;
    try {
      const pokemon = await this.findById(_id);
      if (!pokemon) return false;
      const result = await this.pokeModel.deleteOne({ _id });
      if (result.deletedCount === 1) return true;
      return false;
    } catch (error) {
      this.logger.error(`${method}: ${error}`);
      throw new InternalServerErrorException(
        'There is an error, check server logs',
      );
    }
  }
}
