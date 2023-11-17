const db = require('../db')
const {DataTypes, DATE, Model} = require('sequelize')

class Promocode extends Model {}

const model = Promocode.init({
    id: {
	type: DataTypes.INTEGER,
	primaryKey: true,
	autoIncrement: true,
    },
    name: {
	type: DataTypes.STRING,
	allowNull: false
    },
    amount: {
	type: DataTypes.INTEGER,
	allowNull: false
    },
    createdAt: { type: DATE, field: 'created_at' },
    updatedAt: { type: DATE, field: 'updated_at' },
}, {
    sequelize: db,
    tableName: 'promocodes',
    timestamps: true,
    underscored: true
})

module.exports = model