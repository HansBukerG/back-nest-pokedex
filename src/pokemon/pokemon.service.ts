import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
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
      this.handleException(method, error);
    }
  }

  async findAll(): Promise<Pokemon[] | null> {
    const method = this.findAll.name;
    try {
      const pokemons = await this.pokeModel.find();
      if (pokemons.length === 0) return null;
      return pokemons;
    } catch (error) {
      this.handleException(method, error);
    }
  }

  async findOne(term: string): Promise<Pokemon | null> {
    const method = this.findOne.name;
    try {
      let pokemon: Pokemon;
      if (!isNaN(+term)) pokemon = await this.pokeModel.findOne({ dni: term });

      if (!pokemon && isValidObjectId(term))
        pokemon = await this.pokeModel.findById({ _id: term });

      if (!pokemon)
        pokemon = await this.pokeModel.findOne({
          name: term.toLowerCase().trim(),
        });

      if (!pokemon) return null;

      return pokemon;
    } catch (error) {
      this.handleException(method, error);
    }
  }

  async findById(_id: string): Promise<Pokemon | null> {
    const method = this.findOne.name;
    try {
      const pokemon = await this.pokeModel.findOne({
        _id,
      });
      if (!pokemon) return null;
      return pokemon;
    } catch (error) {
      this.handleException(method, error);
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
      this.handleException(method, error);
    }
  }

  async remove(_id: string): Promise<boolean> {
    const method = this.remove.name;
    try {
      const pokemon = await this.findOne(_id);
      if (!pokemon) return false;
      const result = await this.pokeModel.deleteOne({ _id });
      if (result.deletedCount === 1) return true;
      return false;
    } catch (error) {
      this.handleException(method, error);
    }
  }

  private handleException(method: string, error: any) {
    this.logger.warn(`${method}: ${error}`);
    if (error.code == 11000) {
      throw new BadRequestException('Pokemon already exists');
    }
    throw new InternalServerErrorException(
      'There is an error, check server logs',
    );
  }
}
