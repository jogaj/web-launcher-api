import type { Request, Response } from 'express';
import {
	MSG_USER_NOT_FOUND,
	MSG_USERNAME_NOT_PROVIDED,
} from '../helpers/constants';
import { getUserModelByUserName, handleError } from '../helpers/functions';
import { ApplicationModel } from '../models/application.model';
import { ImageModel } from '../models/image.model';
import { UserModel } from '../models/user.model';

export async function getAll(_req: Request, res: Response): Promise<void> {
	try {
		const { username } = res.locals;

		if (!username) throw new Error(MSG_USERNAME_NOT_PROVIDED);

		const user = await getUserModelByUserName(username);
		if (!user) throw new Error(MSG_USER_NOT_FOUND);

		UserModel.hasMany(ApplicationModel);
		ApplicationModel.belongsTo(UserModel);

		ImageModel.hasMany(ApplicationModel);
		ApplicationModel.belongsTo(ImageModel);

		const applications = (
			await ApplicationModel.findAll({
				include: [
					{
						model: ImageModel,
					},
					{
						model: UserModel,
						where: {
							username: username,
						},
					},
				],
			})
		).map((record) => {
			return record.toJSON();
		});

		res.status(200).json({
			data: applications,
		});
	} catch (error: any) {
		handleError(res, error, [MSG_USERNAME_NOT_PROVIDED, MSG_USER_NOT_FOUND]);
	}
}
