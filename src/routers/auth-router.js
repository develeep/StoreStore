import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
// const { setUserToken } = require('../utils/jwt');

const authRouter = Router();

authRouter.post(
	'/',
	passport.authenticate('local', { session: false }),
	(req, res, next) => {
		setUserToken(res, req.user);
		res.redirect('/');
	},
);

authRouter.get('/kakao', passport.authenticate('kakao'));

authRouter.get(
	'/kakao/callback',
	passport.authenticate('kakao', { failureRedirect: '/', session: false }),
	(req, res, next) => {
		const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
		// 2개 프로퍼티를 jwt 토큰에 담음
		const token = jwt.sign(
			{ userId: req.user._id, role: req.user.role },
			secretKey,
		);
		res.redirect(`/login?token=${token}`);
	},
);

authRouter.get(
	'/google',
	passport.authenticate('google', { scope: ['profile', 'email'] }),
);

authRouter.get(
	'/google/callback',
	passport.authenticate('google', { session: false }),
	(req, res, next) => {
		// userToken 설정하기
		// setUserToken(res, req.user);
		const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

		// 2개 프로퍼티를 jwt 토큰에 담음
		const token = jwt.sign(
			{ userId: req.user._id, role: req.user.role },
			secretKey,
		);
		// return { token };
		// localStorage.setItem('token', token);
		res.redirect(`/login?token=${token}`);
		// res.status(200).json({ token });
	},
);

export { authRouter };
