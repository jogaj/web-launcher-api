import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
	MSG_INVALID_CREDENTIALS,
	MSG_USER_CREATED,
	MSG_USERNAME_EXIST,
	MSG_USERNAME_NOT_PROVIDED,
} from '../helpers/constants';
import { handleError } from '../helpers/functions';
import { UserModel } from '../models/user.model';

export async function addUser(req: Request, res: Response): Promise<void> {
	const { username, password, displayName, isAdmin } = req.body;

	if (!username) throw new Error(MSG_USERNAME_NOT_PROVIDED);

	const user = await UserModel.findOne({ where: { username: username } });

	if (user) throw new Error(MSG_USERNAME_EXIST);

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		await UserModel.create({
			username,
			password: hashedPassword,
			displayName,
			isAdmin,
		});

		res.status(200).json({
			msg: MSG_USER_CREATED,
		});
	} catch (error: any) {
		handleError(
			res,
			error,
			[MSG_USERNAME_NOT_PROVIDED],
			[],
			[MSG_USERNAME_EXIST],
		);
	}
}

export async function login(req: Request, res: Response): Promise<void> {
	try {
		const { username, password } = req.body;

		const user = await UserModel.findOne({ where: { username: username } });
		if (!user) throw new Error(MSG_INVALID_CREDENTIALS);

		const passwordValid = await bcrypt.compare(
			password,
			user.getDataValue('password'),
		);
		if (!passwordValid) throw new Error(MSG_INVALID_CREDENTIALS);

		// Generate token
		const token = jwt.sign(
			{
				username,
				isAdmin: user.getDataValue('isAdmin')
			},
			process.env.SECRET_KEY || 'a!dsfaJHLbc',
			{ expiresIn: '2h' },
		);

		res.status(200).json({token, username, isAdmin: user.getDataValue('isAdmin')});
	} catch (error: any) {
		handleError(res, error, [MSG_INVALID_CREDENTIALS]);
	}
}
