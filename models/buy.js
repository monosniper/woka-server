const {sequelize} = require('../db')
const {DataTypes, DATE, Model} = require('sequelize')

class Buy extends Model {
}

const model = Buy.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    promo: {
        type: DataTypes.STRING,
    },
    amount: {
        type: DataTypes.INTEGER,
    },
    createdAt: {type: DATE, field: 'created_at'},
    updatedAt: {type: DATE, field: 'updated_at'},
}, {
    sequelize,
    tableName: 'buys',
    timestamps: true,
    underscored: true
})

module.exports = model