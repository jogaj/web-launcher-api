import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const LinkModel = sequelize.define('link', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	link: {
		type: DataTypes.STRING,
		unique: false,
		allowNull: false,
	},
	isDefault: {
		type: DataTypes.BOOLEAN,
		allowNull: true,
	},
	applicationId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'applications',
			key: 'id',
		},
	},
});
