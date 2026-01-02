import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const UserModel = sequelize.define('user', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	username: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	displayName: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	isAdmin: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
});
