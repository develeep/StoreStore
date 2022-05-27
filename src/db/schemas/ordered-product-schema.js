import { Schema } from 'mongoose';

const OrderedProductSchema = new Schema(
	{
		orderId: {
			type: String,
			required: true,
		},
		product: {
			type: Schema.Types.ObjectId,
			ref: 'products',
			required: true,
		},
		numbers: {
			type: Number,
			required: true,
		},
	},
	{
		collection: 'orderedProduct',
		timestamps: true,
	},
);

export { OrderedProductSchema };
