import { verifyAccessToken } from './../utils/jwt-auth';
import { IsInt, IsString } from 'class-validator';
import { CutReview } from './../entities/CutReview';
import { Root, Int, Arg, Ctx, Field, FieldResolver, InputType, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { MyContext } from '../apollo/createApolloServer';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import User from '../entities/User';

@InputType()
class CreateOrUpdateCutReviewInput {
	@Field(() => Int, { description: '명장면 번호' })
	@IsInt()
	cutId: number;

	@Field({ description: '감상평 내용' })
	@IsString()
	contents: string;
}

@Resolver(CutReview)
export class CutReviewResolver {
	@Mutation(()=> CutReview, { nullable: true })
	@UseMiddleware(isAuthenticated)
	async createOrUpdateCutReview(
		@Arg('cutReviewInput') cutReviewInput: CreateOrUpdateCutReviewInput,
		@Ctx() { verifiedUser }: MyContext,
	): Promise<CutReview | null> {
		if(!verifiedUser) return null;
		const { contents, cutId } = cutReviewInput;
		//cutId에 대한 기존 감상평 조회
		const prevCutReview = await CutReview.findOne({
			where: { cutId, user: { id: verifiedUser.userId }},
		})
		//cutId에 대한 기존 감상평이 있는 경우
		if(prevCutReview){
			prevCutReview.contents = contents;
			return prevCutReview.save();
		}
		//cutId에 대한 기존 감상평이 없는 경우
		const cutReview = CutReview.create({
			contents: cutReviewInput.contents,
			cutId: cutReviewInput.cutId,
			user: {
				id: verifiedUser.userId,
			},
		});
		return cutReview.save();
	}

	@FieldResolver(()=> User)
	async user(@Root() cutReview: CutReview): Promise<User>{
		return (await User.findOne(cutReview.userId))!;
	}


	@Mutation(() => Boolean)
	@UseMiddleware(isAuthenticated)
	async deleteReview(
		@Arg('id', () => Int) id: number,
		@Ctx() { verifiedUser }: MyContext,
	): Promise<boolean>{
		const result = await CutReview.delete({
			id,
			user: { id: verifiedUser.userId },
		});
		if(result.affected && result.affected > 0){
			return true;
		}
		return false;
	}
}