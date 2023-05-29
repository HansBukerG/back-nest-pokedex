import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Pokeresponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  // private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokeModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async generateSeed(count: number) {
    try {
      await this.pokeModel.deleteMany();
      const url = `https://pokeapi.co/api/v2/pokemon?limit=${count}`;
      const data = await this.http.get<Pokeresponse>(url);

      //forma 1
      const pokemonToInsert: { name: string; dni: number }[] = [];
      data.results.forEach(({ name, url }) => {
        const segments = url.split('/');
        const dni = +segments[segments.length - 2];
        pokemonToInsert.push({ name, dni });
      });

      await this.pokeModel.insertMany(pokemonToInsert);

      // // forma 2
      // const insertPromisesArray = [];
      // data.results.forEach(({ name, url }) => {
      //   const segments = url.split('/');
      //   const dni = +segments[segments.length - 2];
      //   insertPromisesArray.push(this.pokeModel.create({ name, dni }));
      // });
      // await Promise.all(insertPromisesArray);

      return `Seed executed`;
    } catch (error) {
      this.handleExeptions(this.generateSeed, error);
    }
  }

  async deleteSeed(): Promise<number> {
    try {
      const { deletedCount } = await this.pokeModel.deleteMany();
      return deletedCount;
    } catch (error) {
      this.handleExeptions(this.deleteSeed, error);
    }
  }

  handleExeptions(method: any, error: any) {
    this.logger.warn(`${method.name}: ${error}`);
    throw new InternalServerErrorException(
      'There is an error, check server logs',
    );
  }
}
