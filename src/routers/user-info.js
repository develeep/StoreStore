import { Router } from 'express';
import is from '@sindresorhus/is';
import mongoose from 'mongoose';

// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { userService } from '../services';

const userInfoRouter = Router();

userInfoRouter.get('/userdata', loginRequired, async function (req, res, next) {
	try {
		// content-type 을 application/json 로 프론트에서
		// 설정 안 하고 요청하면, body가 비어 있게 됨.
		let currentId = await req.currentUserId;
		const userData = await userService.getUserInfo(currentId);
		const { fullName } = userData;
		let userInfo = {
			fullName: fullName,
		};
		res.status(201).json(userInfo);
		next();
	} catch (error) {
		next(error);
	}
});

userInfoRouter.patch('/', loginRequired, async function (req, res, next) {
	try {
		// content-type 을 application/json 로 프론트에서
		// 설정 안 하고 요청하면, body가 비어 있게 됨.
		if (is.emptyObject(req.body)) {
			throw new Error(
				'headers의 Content-Type을 application/json으로 설정해주세요',
			);
		}
		res.status(200);
	} catch (error) {
		next(error);
	}
});

export { userInfoRouter };
