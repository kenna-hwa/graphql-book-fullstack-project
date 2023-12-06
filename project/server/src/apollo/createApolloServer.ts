import { ApolloServerPluginLandingPageLocalDefault,  } from "apollo-server-core";
import { ApolloServer, } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { FilmResolver } from "../resolvers/Flim";
import { CutResolver } from "../resolvers/Cut";
import { UserResolver } from "../resolvers/User";
import { Request, Response } from "express";
import { JwtVerifiedUser,verifyAccessTokenFromReqHeaders } from "../utils/jwt-auth";
import redis from '../redis/redis-client';
import { createCutVoteLoader } from "../dataloaders/cutVoteLoader";

export interface MyContext {
	req: Request;
	res: Response;
	verifiedUser: JwtVerifiedUser;
	redis: typeof redis;
	cutVoteLoader: ReturnType<typeof createCutVoteLoader>;
}


const createApolloServer = async (): Promise<ApolloServer> => {
	return new ApolloServer({
		schema: await buildSchema({
			resolvers: [FilmResolver, CutResolver, UserResolver],
		}),
		plugins: [ApolloServerPluginLandingPageLocalDefault()],
		context: ({ req, res }) => {
			//액세스 토큰 검증
			const verified = verifyAccessTokenFromReqHeaders(req.headers);
			return { req, res, verifiedUser: verified, redis, cutVoteLoader: createCutVoteLoader() };
		}
	});
}

export default createApolloServer;

