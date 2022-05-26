import passport from 'passport';

import { local } from './strategies/local';
import { newJwtStrategy as jwt } from './strategies/jwt';

const passportIndex = () => {
	passport.use(local);
	// jwt strategy 사용
	passport.use(jwt);
};

export { passportIndex };
