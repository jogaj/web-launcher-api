import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const SettingModel = sequelize.define('setting', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	openNewTab: {
		type: DataTypes.BOOLEAN,
		allowNull: true,
	},
	backgroundImage: {
		type: DataTypes.STRING,
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
