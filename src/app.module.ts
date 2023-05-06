import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon/pokemon.module';
import { env } from './environments/environment';

@Module({
  imports: [PokemonModule, MongooseModule.forRoot(env.DATABASE_URI)],
  controllers: [],
  providers: [],
})
export class AppModule {}
