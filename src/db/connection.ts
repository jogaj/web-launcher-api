import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(
	process.env.DB_NAME ?? 'db',
	process.env.DB_USER ?? 'user',
	process.env.DB_PASSWORD ?? 'password',
	{
		host: process.env.DB_HOST ?? 'host',
		dialect: 'postgres',
		port: parseInt(process.env.DB_HOST_PORT ?? '5432'),
	},
);

export default sequelize;
