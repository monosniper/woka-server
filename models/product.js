const db = require('../db')
const {DataTypes, DATE, Model} = require('sequelize')

class Product extends Model {}

const model = Product.init({
    id: {
	type: DataTypes.INTEGER,
	primaryKey: true,
	autoIncrement: true,
    },
    image: {
	type: DataTypes.STRING,
    },
    title: {
	type: DataTypes.STRING,
	allowNull: false
    },
    description: {
	type: DataTypes.TEXT,
    },
    price_1: {
	type: DataTypes.DOUBLE,
    },
    price_3: {
	type: DataTypes.DOUBLE,
    },
    price: {
	type: DataTypes.DOUBLE,
    },
    rcon_1: {
	type: DataTypes.TEXT,
    },
    rcon_3: {
	type: DataTypes.TEXT,
    },
    rcon_forever: {
	type: DataTypes.TEXT,
    },
    rcon: {
	type: DataTypes.TEXT,
    },
    createdAt: { type: DATE, field: 'created_at' },
    updatedAt: { type: DATE, field: 'updated_at' },
}, {
    sequelize: db,
    tableName: 'products',
    timestamps: true,
    underscored: true
})

module.exports = model