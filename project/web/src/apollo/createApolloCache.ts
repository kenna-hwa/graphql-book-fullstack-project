import { InMemoryCache  } from "@apollo/client";
import { PaginatedFilms } from "../generated/graphql";

export const createApolloCache = (): InMemoryCache => {
	return new InMemoryCache({
		typePolicies:{
      Query: {
        fields: {
          films: {
            keyArgs: false, // 캐시가 키값으로 사용하는 인자 목록을 의미. 근데 우린 안씀.
            merge: (
              existing: PaginatedFilms | undefined,
              incoming: PaginatedFilms,
            ): PaginatedFilms => {
              return {
                cursor: incoming.cursor,
                films: existing
                ? [...existing.films, ...incoming.films]
                : incoming.films,
              };
            },
          },
        },
      },
    },
	});
}