import {
  Arg,
  Field,
  FieldResolver,
  Int,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import ghibliData from '../data/ghibli';
import { Director } from '../entities/Director';
import { Film } from '../entities/Film';

// 페이지처리된 영화목록 반환 오브젝트 타입
// @ObjectType()
// class PaginatedFilms {
//   @Field(() => [Film])
//   films: Film[];

//   @Field(() => Int, { nullable: true })
//   cursor?: Film['id'] | null;
// }

@Resolver(Film)
export class FilmResolver {
  @Query(() => [Film])
  films(): Film[] {
		return ghibliData.films;
	}

  @FieldResolver(() => Director)
  director(@Root() parentFilm: Film): Director | undefined {
    return ghibliData.directors.find((dr) => dr.id === parentFilm.director_id)
  }
}

type Query = {
  films: [Film]
}