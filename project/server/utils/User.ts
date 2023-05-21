import  jwt  from "jsonwebtoken";
import User from "../src/entities/User";

export const DEFAULT_JWT_SECRET_KEY = 'secret-key';

export interface JwtVerifiedUser {
	userId: User['id'];
}

// 액세스 토큰 발급
export 	const createAccessToken = (user: User): string => {

	const userData: JwtVerifiedUser = 	{ userId: user.id };

	const accessToken = jwt.sign(
		{ userId: user.id },
		process.env.JWT_SECRET_KEY || 'secret-key',
		{			expiresIn: '30m',		}
	)
		return accessToken;
		};


