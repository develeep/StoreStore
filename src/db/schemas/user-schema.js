import { Schema } from 'mongoose';

const UserSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			default: 'no_email',
		},
		fullName: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: false,
		},
		address: {
			type: new Schema(
				{
					postalCode: String,
					address1: String,
					address2: String,
				},
				{
					_id: false,
				},
			),
			required: false,
		},
		role: {
			type: String,
			required: false,
			default: 'basic-user',
		},
		passwordReset: {
			type: Boolean,
			default: false,
		},
		provider: {
			type: String,
			required: false,
		},
	},
	{
		collection: 'users',
		timestamps: true,
	},
);

export { UserSchema };
