import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon/pokemon.module';
import { env } from './environments/environment';
import { CommonModule } from './common/common.module';

@Module({
  imports: [PokemonModule, MongooseModule.forRoot(env.DATABASE_URI), CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
