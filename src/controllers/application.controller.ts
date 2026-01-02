import type { Request, Response } from 'express';
import { type FindOptions, type Model, Op } from 'sequelize';
import {
	MSG_APPLICATION_CREATED,
	MSG_APPLICATION_DELETED,
	MSG_APPLICATION_NOT_FOUND,
	MSG_APPLICATION_UPDATED,
	MSG_USER_NOT_FOUND,
	MSG_USERNAME_NOT_PROVIDED,
} from '../helpers/constants';
import { getUserModelByUserName, handleError } from '../helpers/functions';
import { ApplicationModel } from '../models/application.model';
import { ImageModel } from '../models/image.model';
import { LinkModel } from '../models/link.model';
import { UserModel } from '../models/user.model';

export async function getAll(_req: Request, res: Response): Promise<void> {
	try {
		const { username } = res.locals;

		if (!username) throw new Error(MSG_USERNAME_NOT_PROVIDED);

		const user = await getUserModelByUserName(username);
		if (!user) throw new Error(MSG_USER_NOT_FOUND);

		UserModel.hasMany(ApplicationModel);
		ApplicationModel.belongsTo(UserModel);

		ApplicationModel.hasMany(LinkModel);
		LinkModel.belongsTo(ApplicationModel);

		ImageModel.hasMany(ApplicationModel);
		ApplicationModel.belongsTo(ImageModel);

		const applications = (
			await ApplicationModel.findAll({
				include: [
					{
						model: LinkModel,
					},
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

export async function get(req: Request, res: Response): Promise<void> {
	try {
		const { username } = res.locals;

		if (!username) throw new Error(MSG_USERNAME_NOT_PROVIDED);

		const user = await getUserModelByUserName(username);
		if (!user) throw new Error(MSG_USER_NOT_FOUND);

		UserModel.hasMany(ApplicationModel);
		ApplicationModel.belongsTo(UserModel);

		ApplicationModel.hasMany(LinkModel);
		LinkModel.belongsTo(ApplicationModel);

		ImageModel.hasMany(ApplicationModel);
		ApplicationModel.belongsTo(ImageModel);

		const applicationId = req.params.id;
		const applicationFindOptions: FindOptions = {
			include: [
				{
					model: LinkModel,
				},
				{
					model: ImageModel,
				},
				{
					model: UserModel,
				},
			],
			where: {
				[Op.and]: [
					{ id: parseInt(applicationId) },
					{ userId: user.getDataValue('id' as any) },
				],
			},
		};

		const application = await ApplicationModel.findOne(applicationFindOptions);

		if (!application) throw new Error(MSG_APPLICATION_NOT_FOUND);

		res.status(200).json({
			data: application,
		});
	} catch (error: any) {
		handleError(
			res,
			error,
			[MSG_USERNAME_NOT_PROVIDED, MSG_USER_NOT_FOUND],
			[MSG_APPLICATION_NOT_FOUND],
		);
	}
}

export async function add(req: Request, res: Response): Promise<void> {
	try {
		const { username } = res.locals;
		const { name, color, image, links } = req.body;

		if (!username) throw new Error(MSG_USERNAME_NOT_PROVIDED);

		const user = await getUserModelByUserName(username);
		if (!user) throw new Error(MSG_USER_NOT_FOUND);

		const newImage = await ImageModel.create({ data: image });

		const newApplication = await ApplicationModel.create({
			name,
			color,
			imageId: newImage.getDataValue('id'),
			userId: user.getDataValue('id' as any),
		});

		const linksToAdd = (links as any[]).reduce((acc, link) => {
			if (link.id < 0) {
				acc.push({
					...link,
					id: null,
					applicationId: newApplication.getDataValue('id'),
				});
			}
			return acc;
		}, []);

		LinkModel.bulkCreate(linksToAdd);

		res.status(200).json({
			msg: MSG_APPLICATION_CREATED,
		});
	} catch (error: any) {
		handleError(res, error, [MSG_USERNAME_NOT_PROVIDED, MSG_USER_NOT_FOUND]);
	}
}

export async function update(req: Request, res: Response): Promise<void> {
	try {
		const { username } = res.locals;

		if (!username) throw new Error(MSG_USERNAME_NOT_PROVIDED);

		const user = await getUserModelByUserName(username);
		if (!user) throw new Error(MSG_USER_NOT_FOUND);

		const applicationId = req.params.id;
		const applicationFindOptions: FindOptions = {
			where: {
				[Op.and]: [
					{ id: parseInt(applicationId) },
					{ userId: user.getDataValue('id' as any) },
				],
			},
		};
		const application = await getApplicationModel(applicationFindOptions);
		if (!application) throw new Error(MSG_APPLICATION_NOT_FOUND);

		const { name, color, image, links } = req.body;
		let imageId = req.body.imageId;

		const linksToAdd: any[] = [];
		const linksToRemove: string[] = [];
		const linksToUpdate: any[] = [];

		links.forEach((link: any) => {
			if (link.id < 0) {
				linksToAdd.push({
					...link,
					id: null,
					applicationId: application.getDataValue('id' as any),
				});
			}
			if (link.isRemoved) {
				linksToRemove.push(link.id);
			}
			if (link.id >= 0 && !link.isRemoved) {
				linksToUpdate.push(link);
			}
		});

		if (linksToAdd.length > 0) {
			LinkModel.bulkCreate(linksToAdd);
		}

		if (linksToRemove.length > 0) {
			await LinkModel.destroy({ where: { id: linksToRemove } });
		}

		if (linksToUpdate.length > 0) {
			linksToUpdate.forEach(async (link: any) => {
				await LinkModel.update(link, { where: { id: link.id } });
			});
		}

		if (!imageId) {
			const newImage = await ImageModel.create({ data: image });
			imageId = newImage.getDataValue('id');
		}

		ApplicationModel.update(
			{ name, color, imageId },
			{ where: { id: application.getDataValue('id' as any) } },
		);

		res.json({
			msg: MSG_APPLICATION_UPDATED,
		});
	} catch (error: any) {
		handleError(
			res,
			error,
			[MSG_USERNAME_NOT_PROVIDED, MSG_USER_NOT_FOUND],
			[MSG_APPLICATION_NOT_FOUND],
		);
	}
}

export async function remove(req: Request, res: Response): Promise<void> {
	try {
		const { username } = res.locals;

		if (!username) throw new Error(MSG_USERNAME_NOT_PROVIDED);

		const user = await getUserModelByUserName(username);
		if (!user) throw new Error(MSG_USER_NOT_FOUND);

		const applicationId = parseInt(req.params.id);
		const applicationFindOptions: FindOptions = {
			where: {
				[Op.and]: [
					{ id: applicationId },
					{ userId: user.getDataValue('id' as any) },
				],
			},
		};
		const application = await getApplicationModel(applicationFindOptions);

		if (!application) throw new Error(MSG_APPLICATION_NOT_FOUND);

		// Delete related records first
		await LinkModel.destroy({
			where: { applicationId: applicationId },
		});

		// Then delete the main record
		await ApplicationModel.destroy({
			where: { id: applicationId },
		});

		res.json({
			msg: MSG_APPLICATION_DELETED,
		});
	} catch (error: any) {
		handleError(
			res,
			error,
			[MSG_USERNAME_NOT_PROVIDED, MSG_USER_NOT_FOUND],
			[MSG_APPLICATION_NOT_FOUND],
		);
	}
}

function getApplicationModel(
	findOptions: FindOptions,
): Promise<Model<typeof ApplicationModel> | null> {
	return ApplicationModel.findOne(findOptions);
}
