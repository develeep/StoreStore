import { Schema } from 'mongoose';

const ReviewSchema = new Schema(
	{
		comment: {
			type: String,
			required: true,
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: 'users',
			required: true,
		},
	},
	{
		collection: 'reviews',
		timestamps: true,
	},
);

export { ReviewSchema };
