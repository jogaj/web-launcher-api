import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

// const sequelize = new Sequelize(
// 	process.env.DB_NAME ?? 'db',
// 	process.env.DB_USER ?? 'user',
// 	process.env.DB_PASSWORD ?? 'password',
// 	{
// 		host: process.env.DB_HOST ?? 'host',
// 		dialect: 'postgres',
// 		port: parseInt(process.env.DB_HOST_PORT ?? '5432'),
// 	},
// );

// const sequelize = new Sequelize("postgres://postgres:Zt7P2QxHUfTL@db.jxhtadplgvivduoigjuz.supabase.co:5432/postgres"
// );

// const sequelize = new Sequelize('postgresql://postgres.jxhtadplgvivduoigjuz:Zt7P2QxHUfTL@aws-1-us-east-1.pooler.supabase.com:5432/postgres');

const sequelize = new Sequelize(
	'postgres',
	'postgres.jxhtadplgvivduoigjuz',
	'Zt7P2QxHUfTL',
	{
		host: 'aws-1-us-east-1.pooler.supabase.com',
		dialect: 'postgres',
	},
);

export default sequelize;
