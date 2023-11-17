const db = require('../db')
const {DataTypes, DATE, Model} = require('sequelize')

class Buy extends Model {}

const model = Buy.init({
    id: {
	type: DataTypes.INTEGER,
	primaryKey: true,
	autoIncrement: true,
    },
    author_name: {
	type: DataTypes.STRING,
	allowNull: false
    },
    createdAt: { type: DATE, field: 'created_at' },
    updatedAt: { type: DATE, field: 'updated_at' },
}, {
    sequelize: db,
    tableName: 'buys',
    timestamps: true,
    underscored: true
})

module.exports = model