import type { Response } from 'express';
import type { Model } from 'sequelize';
import { UserModel } from '../models/user.model';
import { MSG_GENERIC_ERROR } from './constants';

export function handleError(
	res: Response,
	error: any,
	badRequestErrors: string[] = [],
	notFoundErrors: string[] = [],
	duplicateErrors: string[] = [],
): void {
	let errorCode = 500;
	if (error?.message) {
		if (badRequestErrors.includes(error.message)) {
			errorCode = 400;
		} else if (notFoundErrors.includes(error.message)) {
			errorCode = 404;
		} else if (duplicateErrors.includes(error.message)) {
			errorCode = 409;
		}
	}

	res.status(errorCode).json({
		msg: MSG_GENERIC_ERROR,
		error: error.message,
	});
}

export function getUserModelByUserName(
	username: string,
): Promise<Model<typeof UserModel> | null> {
	return UserModel.findOne({ where: { username } });
}
