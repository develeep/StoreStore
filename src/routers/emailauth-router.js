//Express
import { Router } from 'express';
const emailRouter = Router();
//Module
import { createTransport } from 'nodemailer';
import { hash, compareSync } from 'bcrypt';
import { userService } from '../services';

// -- Start Code -- //

// nodemailer 설정
const smtpTransport = createTransport({
	service: 'Naver',
	auth: {
		user: process.env.NAVER_EMAIL_ID,
		pass: process.env.NAVER_EMAIL_PW,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

// 이메일 전송
emailRouter.post('/sendmail', async (req, res, next) => {
	const reademailaddress = req.body.email;
	try {
		const exEmail = await userService.findByEmail(reademailaddress);
		// 이메일이 중복됐을 때
		if (exEmail) {
			return res.send({ result: 'exist' });
		} else {
			let authNum = Math.random().toString().substr(2, 6);
			console.log(authNum);
			const hashAuth = await hash(authNum, 12);
			console.log(hashAuth);
			res.cookie('hashAuth', hashAuth, {
				maxAge: 300000,
			});
			const mailOptions = {
				from: process.env.NAVER_EMAIL_ID,
				to: reademailaddress,
				subject: 'ELICE 8TEAM 인증번호 관련 메일 입니다.',
				text: '인증번호는 ' + authNum + ' 입니다.',
				html:
					"<div style='font-family: 'Apple SD Gothic Neo', 'sans-serif' !important; width: 540px; height: 600px; border-top: 4px solid #348fe2; margin: 100px auto; padding: 30px 0; box-sizing: border-box;'>" +
					"<h1 style='margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400;'>" +
					"<span style='font-size: 15px; margin: 0 0 10px 3px;'>Elice 8 TEAM</span><br />" +
					"<span style='color: #348fe2;'>인증번호</span> 안내입니다." +
					'</h1>' +
					"<p style='font-size: 16px; line-height: 26px; margin-top: 50px; padding: 0 5px;'>" +
					'안녕하세요.<br />' +
					'요청하신 인증번호가 생성되었습니다.<br />' +
					'감사합니다.' +
					'</p>' +
					"<p style='font-size: 16px; margin: 40px 5px 20px; line-height: 28px;'>" +
					'인증번호: <br />' +
					"<span style='font-size: 24px;'>" +
					authNum +
					'</span>' +
					'</p>' +
					"<div style='border-top: 1px solid #DDD; padding: 5px;'>" +
					'</div>' +
					'</div>',
			};
			smtpTransport.sendMail(mailOptions, (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log('success');
				}
				smtpTransport.close();
			});

			return res.send({ result: 'send' });
		}
	} catch (err) {
		res.send({ result: 'fail' });
		console.error(err);
		next(err);
	}
});

// 이메일 인증
emailRouter.post('/checkEmail', async (req, res, next) => {
	const CEA = req.body.Enumber;
	const hashAuth = req.body.hashAuth;
	try {
		if (compareSync(CEA, hashAuth)) {
			res.send({ result: 'success' });
		} else {
			res.send({ result: 'fail' });
		}
	} catch (err) {
		res.send({ result: 'fail' });
		console.error(err);
		next(err);
	}
});

export { emailRouter };
