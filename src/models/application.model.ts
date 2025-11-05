import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const ApplicationModel = sequelize.define('application', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
	color: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	imageId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'images',
			key: 'id',
		},
	},
	order: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'users',
			key: 'id',
		},
	},
});
