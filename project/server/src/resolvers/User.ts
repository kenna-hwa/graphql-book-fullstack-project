import { Arg, Field, InputType, Mutation, Resolver, ObjectType, Query, Ctx, UseMiddleware } from "type-graphql";
import { IsEmail, IsString } from "class-validator";
import  argon2  from "argon2";
import { REFRESH_JWT_SECRET_KEY, createAccessToken, setRefreshTokenHeader,createRefreshToken } from '../utils/jwt-auth';
import User from "../entities/User";
import { MyContext  } from "../apollo/createApolloServer";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import jwt from 'jsonwebtoken';


@InputType()
export class SignUpInput {
	@Field() @IsEmail() email: string;
	@Field() @IsString() username: string;
	@Field() @IsString() password: string;
}

@InputType({ description: '로그인 인풋 데이터' })
export class LoginInput {
	@Field() @IsString() emailOrUsername: string;
	@Field() @IsString() password: string;
}

@ObjectType({ description: '필드 에러 타입' })
class FieldError {
	@Field() field: string;
	@Field() message: string;
}

@ObjectType({ description: '로그인 반환 데이터'})
class LoginResponse {
	@Field(()=>[FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(()=> User, { nullable: true })
	user?: User;

	@Field({ nullable: true })
	accessToken? : string;
}


@ObjectType({ description: "액세스 토큰 새로고침 반환 데이터" })
class RefreshAccessTokenResponse{
	@Field() accessToken: string;
}

@Resolver(User)
export class UserResolver {
	@Mutation(() => User)
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.verifiedUser) return undefined;
    return User.findOne({ where: { id: ctx.verifiedUser.userId } });
  }

	@Mutation(() => User)
	async signUp(@Arg('signUpInput') signUpInput : SignUpInput): Promise<User>{
		const { email, username, password } = signUpInput;

		const hashedPw = await argon2.hash(password)
		const newUser = User.create({
			email,
			username,
			password: hashedPw
		});
		await User.insert(newUser)
		return newUser;
	}

	@Mutation(()=>LoginResponse)
	public async login(
		@Arg('loginInput') loginInput : LoginInput,
		@Ctx() { res, redis } : MyContext,
	) : Promise<LoginResponse> {
		const { emailOrUsername, password } = loginInput;

		// 유저 확인 로직

		const user = await User.findOne({ where: [{ email:  emailOrUsername  }, { username: emailOrUsername}] });

		if(!user)
		return { 
			errors: [{ field: 'emailOrUsername', message: '해당하는 유저가 없습니다.' }],
		};

		const isVaild = await argon2.verify(user.password, password);
		if(!isVaild)
		return {
				errors: [
					{ field: 'password', message: '비밀번호를 올바르게 입력해주세요.'}
				],
		};
		
		//액세스 토큰 발급
		const accessToken  = createAccessToken(user);
		const refreshToken = createRefreshToken(user);
		//리프레시 토큰 레디스 적재
		await redis.set(String(user.id), refreshToken);
		//쿠키로 리프레시 토큰 전송
		setRefreshTokenHeader(res, refreshToken);

		return { user, accessToken };
	}
	@Mutation(() => Boolean)
	@UseMiddleware(isAuthenticated)
	async logout(
		@Ctx() { verifiedUser, res, redis }: MyContext,
	): Promise<boolean>{
		if(verifiedUser){
			setRefreshTokenHeader(res, '');//리프레시 토큰 쿠키 제거
			await redis.del(String(verifiedUser.userId));//레디스 리프레시 토큰 제거
		}
		return true;
	}
	
	@Mutation(()=> RefreshAccessTokenResponse, { nullable: true })
	async refreshAccessToken(
		@Ctx() { req, redis, res }: MyContext,
	): Promise<RefreshAccessTokenResponse | null> {


		const refreshToken = req.cookies.refreshtoken;
		console.log("refreshToken",refreshToken)
		if(!refreshToken) return null;
		console.log("106")

		let tokenData: any = null;
		console.log("108")

		try{
			console.log("refreshToken", refreshToken);
			console.log("REFRESH_JWT_SECRET_KEY", REFRESH_JWT_SECRET_KEY)
			tokenData = jwt.verify(refreshToken, REFRESH_JWT_SECRET_KEY);
			console.log("tokenData", tokenData)
		}catch(e){
			console.error(e)
			return null;
		}
		if(!tokenData) return null;
		console.log("117")


		//레디스상에 user.id 로 저장된 토큰 조회
		const storedRefreshToken = await redis.get(String(tokenData.userId));
		if(!storedRefreshToken) return null;
		if(!(storedRefreshToken === refreshToken)) return null;

		const user = await User.findOne({ where: { id: tokenData.userId }});
		if(!user) return null;

		const newAccessToken = createAccessToken(user);
		const newRefreshToken = createRefreshToken(user);
		//리프레시 토큰 redis 저장
		await redis.set(String(user.id), newRefreshToken);

		//쿠키로 리프레시 토큰 전송
		res.cookie('refreshtoken', newRefreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
		});

		return { accessToken: newAccessToken }
	
	}


}