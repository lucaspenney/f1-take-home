import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './User';
 
export class Community {
	@prop({ required: true })
	public name?: string;

	@prop()
	public logo?: string;

	@prop({ ref: () => 'User' })
	public users?: Ref<typeof User>[];

}

export const CommunityModel = getModelForClass(Community);
