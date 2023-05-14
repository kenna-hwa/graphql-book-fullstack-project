import { Arg, Field, InputType, Mutation, Resolver, ObjectType } from "type-graphql";
import User from "../entities/User";
import { IsEmail, IsString } from "class-validator";
import  argon2  from "argon2";

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

@Resolver(User)
export class UserResolver {
	@Mutation(()=>User)
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
	) : Promise<LoginResponse> {
		const { email, password } = loginInput;

		const user = await User.findOne({ where: {  email  } });

		if(!user)
		return { 
			errors: [{ field: 'email', message: '해당하는 유저가 없습니다.' }],
		};

		const isVaild = await argon2.verify(user.password, password);
		if(!isVaild)
		return {
				errors: [
					{ field: 'password', message: '비밀번호를 올바르게 입력해주세요.'}
				],
		};
		return { user };
	}
}