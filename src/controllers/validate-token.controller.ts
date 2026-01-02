import dotenv from 'dotenv';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { MSG_INVALID_TOKEN, MSG_UNAUTHORIZED } from '../helpers/constants';

dotenv.config();

const verifyFn = (headerToken: string) => {
	const bearerToken = headerToken.slice(7);
	return jwt.verify(bearerToken, process.env.SECRET_KEY || 'a!dsfaJHLbc');
};

export function validateToken(req: Request, res: Response, next: NextFunction) {
	const headerToken = req.headers.authorization;

	if (headerToken?.startsWith('Bearer ')) {
		try {
			const token = verifyFn(headerToken);
			res.locals.username = (token as jwt.JwtPayload).username;
			next();
		} catch (error) {
			res.status(400).json({
				msg: MSG_INVALID_TOKEN,
				error,
			});
		}
	} else {
		res.status(401).json({
			msg: MSG_UNAUTHORIZED,
		});
	}
}

export function authorize(req: Request, res: Response) {
	const headerToken = req.headers.authorization;
	if (
		headerToken === undefined ||
		headerToken === null ||
		!headerToken.startsWith('Bearer ')
	) {
		res.json({ data: null });
		return;
	}

	const verify = verifyFn(headerToken);
	console.log(verify);
	res.json({ data: verify });
}
