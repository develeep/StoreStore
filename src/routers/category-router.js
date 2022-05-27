import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { cateService } from '../services';
import { SmallcateService } from '../services';
import bcrypt from 'bcrypt';

const categoryRouter = Router();

// 회원가입 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
categoryRouter.post('/category_update', async (req, res, next) => {
	try {
		// Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
		// application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
		if (is.emptyObject(req.body)) {
			throw new Error(
				'headers의 Content-Type을 application/json으로 설정해주세요',
			);
		}

		// req (request)의 body 에서 데이터 가져오기
		const Bcategory = req.body.Bcategory;
		const Scategory = req.body.Scategory;

		// 위 데이터를 유저 db에 추가하기
		const getCategoryInfo = await cateService.getCategory({
			Bcategory,
			Scategory,
		});
		console.log(getCategoryInfo);

		const newCategory = await SmallcateService.addCategory(getCategoryInfo);

		// 추가된 유저의 db 데이터를 프론트에 다시 보내줌
		// 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
		res.status(200).json(newCategory);
	} catch (error) {
		next(error);
	}
});

categoryRouter.get('/getcategorys', async (req, res, next) => {
	try {
		// 위 데이터를 유저 db에 추가하기
		let newCategory = await SmallcateService.getCategorys();
		res.status(200).json(newCategory);
	} catch (error) {
		next(error);
	}
});

categoryRouter.get('/getSmallcategory', async (req, res, next) => {
	try {
		// 위 데이터를 유저 db에 추가하기
		let getSmallcategory = await SmallcateService.getCategoryname('운동화');
		res.status(200).json(getSmallcategory);
	} catch (error) {
		next(error);
	}
});

export { categoryRouter };
