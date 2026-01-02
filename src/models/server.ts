import cors from 'cors';
import express from 'express';
import routesApplication from '../routes/application.route';
import routesSetting from '../routes/setting.route';
import routesUser from '../routes/user.route';
import { ApplicationModel } from './application.model';
import { ImageModel } from './image.model';
import { LinkModel } from './link.model';
import { SettingModel } from './setting.model';
import { UserModel } from './user.model';

export class ServerModel {
	private _app: express.Application;
	private _port: number;

	constructor() {
		this._app = express();
		this._port = parseInt(process.env.PORT ?? '3001');
		this.listen();
		this.middlewares();
		this.routes();
		this.dbConnect();
	}

	listen(): void {
		this._app.listen(this._port, () => {
			console.log(`Api running on port ${this._port}`);
		});
	}

	routes(): void {
		this._app.use('/api/users', routesUser);
		this._app.use('/api/applications', routesApplication);
		this._app.use('/api/settings', routesSetting);
	}

	async dbConnect() {
		try {
			await UserModel.sync(/* { force: true } */);
			await ImageModel.sync(/* { force: true } */);
			await ApplicationModel.sync(/* { force: true } */);
			await LinkModel.sync(/* { force: true } */);
			await SettingModel.sync(/* { force: true } */);
			console.log(`Connected to the database`);
		} catch (error) {
			console.log(`Unable to connect to the database: ${error}`);
		}
	}

	middlewares(): void {
		this._app.use(express.json({ limit: '50mb' }));
		this._app.options('*', cors());
		this._app.use(cors());
	}
}
