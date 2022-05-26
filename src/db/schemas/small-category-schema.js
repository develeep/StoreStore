import { Schema } from 'mongoose';

const smallCategorySchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		bCategory: {
			type: Schema.Types.ObjectId,
			ref: 'category',
			required: true,
		},
	},
	{
		collection: 'scategory',
		timestamps: true,
	},
);

export { smallCategorySchema };
