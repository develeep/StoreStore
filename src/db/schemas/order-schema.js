import { Schema } from 'mongoose';
import { shortId } from './types/short-id';

const OrderSchema = new Schema(
	{
		// 주문번호
		orderId: shortId,
		buyer: {
			type: Schema.Types.ObjectId,
			ref: 'users',
			required: true,
		},
		purchasedProduct: {
			type: new Schema(
				{
					product: {
						type: Schema.Types.ObjectId,
						ref: 'products',
					},
					numbers: Number,
				},
				{
					_id: false,
				},
			),
			required: true,
		},
		delivery: {
			type: String,
			required: true,
			default: 'preparing for delivery',
		},
	},
	{
		collection: 'orders',
		timestamps: true,
	},
);

export { OrderSchema };
