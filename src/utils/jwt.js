import jwt from 'jsonwebtoken';

const secret = 'elice';

export {secret};

const setUserToken = (res, user) => {
  // 유저 jwt 토큰생성
  const token = jwt.sign(user, secret);
  // 토큰을 쿠키로 전달
  res.cookie('token', token);
}

export {setUserToken};