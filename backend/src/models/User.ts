import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Community } from './Community';


export class User {
	@prop({ required: true })
	public email?: string;

	@prop({ required: true, select: false })
	public passwordHash?: string;

	@prop()
	public profilePicture?: string;

	@prop({ required: true, select: false, default: [] })
	public experiencePoints?: {points: number, timestamp: Date}[];

	@prop({ ref: () => 'Community', default: null })
	public currentCommunity?: Ref<Community>|null;
}

export const UserModel = getModelForClass(User);