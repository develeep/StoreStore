import multer from 'multer';
import multerS3, { AUTO_CONTENT_TYPE } from 'multer-s3';
import { S3 } from 'aws-sdk';

const s3 = new S3({
	accessKeyId: 'AKIARKM2AQZL4NP7WBUX', // 액세스 키 입력
	secretAccessKey: 'yTJEgOF8tIbNki2T9FQD848WdClVtwd3R3Gh796g', // 비밀 액세스 키 입력
	region: 'ap-northeast-2', // 사용자 사용 지역 (서울의 경우 ap-northeast-2)
});

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'elice08-bucket',
		acl: 'public-read',
		contentType: multerS3.AUTO_CONTENT_TYPE,
		key: function (req, file, cb) {
			cb(
				null,
				Math.floor(Math.random() * 1000).toString() +
					Date.now() +
					'.' +
					file.originalname,
			);
		},
	}),
	limits: {
		fileSize: 1000 * 1000 * 10,
	},
});

export default upload;
