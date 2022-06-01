import { Schema } from 'mongoose';
import { shortId } from './types/short-id';

const ProductSchema = new Schema(
	{
		productId: shortId,
		category: {
			type: Schema.Types.ObjectId,
			ref: 'scategory',
			required: false,
		},
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		company: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: false,
		},
		imageKey: {
			type: String,
			required: false,
		},
		description: {
			type: String,
			required: false,
		},
		salesRate: {
			type: Number,
			required: true,
			default: 0,
		},
		inventory: {
			type: Number,
			required: true,
		},
		review: [
			{
				type: Schema.Types.ObjectId,
				ref: 'reviews',
				required: false,
			},
		],
	},
	{
		collection: 'products',
		timestamps: true,
	},
);

export { ProductSchema };
