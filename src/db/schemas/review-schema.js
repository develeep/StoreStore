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
		starRate: {
			type: Number,
			required: false,
		},
		productId: {
			type: String,
			required: false,
		},
	},
	{
		collection: 'reviews',
		timestamps: true,
	},
);

export { ReviewSchema };
