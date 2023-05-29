import {
  Controller,
  Delete,
  Get,
  Logger,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  private readonly logger = new Logger(SeedController.name);
  constructor(
    private readonly seedService: SeedService,
    private readonly pokemonService: PokemonService,
  ) {}

  @Get()
  async executeSeed(@Query('count', ParseIntPipe) count: number) {
    const pokeSeed = await this.seedService.generateSeed(count);
    const message = `This method has beed added ${pokeSeed.length} to the atabase!`;
    this.logger.log(`${this.executeSeed.name}: ${message}`);
    return {
      message,
      data: pokeSeed,
    };
  }

  @Delete()
  async deleteSeed() {
    const deletedCount = await this.seedService.deleteSeed();
    const message = `This method has deleted: ${deletedCount} items from pokemon collection`;
    this.logger.log(`${this.deleteSeed.name}: ${message}`);
    return {
      message,
    };
  }
}
