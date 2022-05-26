import { Schema } from 'mongoose';
import { shortId } from './types/short-id';

const ProductSchema = new Schema(
	{
		shortId,
		category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
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
		imageUrl: {
			type: String,
			required: false,
		},
		description: {
			type: String,
			required: false,
		},
		purchageQuantity: {
			type: Number,
			required: true,
			default: 0,
		},
		inventory: {
			type: Number,
			required: true,
		},
		review: {
			type: Schema.Types.ObjectId,
			ref: 'Review',
			required: false,
		},
	},
	{
		collection: 'products',
		timestamps: true,
	},
);

export { ProductSchema };
