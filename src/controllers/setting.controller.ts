import type { Request, Response } from 'express';
import {
	MSG_SETTING_NOT_FOUND,
	MSG_USER_NOT_FOUND,
	MSG_USERNAME_NOT_PROVIDED,
} from '../helpers/constants';
import { getUserModelByUserName, handleError } from '../helpers/functions';
import { SettingModel } from '../models/setting.model';
import { UserModel } from '../models/user.model';

export async function getByUser(_req: Request, res: Response): Promise<void> {
	try {
		const { username } = res.locals;

		if (!username) throw new Error(MSG_USERNAME_NOT_PROVIDED);

		const user = await getUserModelByUserName(username);
		if (!user) throw new Error(MSG_USER_NOT_FOUND);

		UserModel.hasOne(SettingModel);
		SettingModel.belongsTo(UserModel);

		const settings = await SettingModel.findOne({
			include: [
				{ model: UserModel, where: { username: username }, attributes: [] },
			],
		});

		if (!settings) throw new Error(MSG_SETTING_NOT_FOUND);

		res.status(200).json({
			data: settings.toJSON(),
		});
	} catch (error: any) {
		handleError(
			res,
			error,
			[MSG_USERNAME_NOT_PROVIDED, MSG_USER_NOT_FOUND],
			[MSG_SETTING_NOT_FOUND],
		);
	}
}
