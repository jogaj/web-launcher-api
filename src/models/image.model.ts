import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const ImageModel = sequelize.define('image', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	data: {
		type: DataTypes.BLOB,
		unique: false,
		allowNull: false,
	},
});
