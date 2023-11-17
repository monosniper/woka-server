const db = require('../db')
const {DataTypes, DATE, Model} = require('sequelize')

class Tag extends Model {}

const model = Tag.init({
    id: {
	type: DataTypes.INTEGER,
	primaryKey: true,
	autoIncrement: true,
    },
    name: {
	type: DataTypes.STRING(255),
	allowNull: false
    },
    icon: {
	type: DataTypes.STRING(255),
    },
    isPrivilege: {
	type: DataTypes.BOOLEAN,
	defaultValue: false,
    },
    createdAt: { type: DATE, field: 'created_at' },
    updatedAt: { type: DATE, field: 'updated_at' },
}, {
    sequelize: db,
    tableName: 'tags',
    timestamps: true,
    underscored: true
})

module.exports = model