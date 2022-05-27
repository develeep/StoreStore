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
		priceSum: {
			types: Number,
			required: false,
			default: 0,
		},
		deliveryStatus: {
			type: String,
			required: false,
			default: '배송준비중',
		},
		requestMessage: {
			type: String,
			required: false,
		},
		receiver: {
			type: new Schema(
				{
					name: String,
					phoneNumber: String,
					address: String,
				},
				{
					_id: false,
				},
			),
			required: false,
		},
	},
	{
		collection: 'orders',
		timestamps: true,
	},
);

export { OrderSchema };
