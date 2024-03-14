const {sequelize} = require('../db')
const {DataTypes, DATE, Model} = require('sequelize')

class History extends Model {
}

const model = History.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    online: {
        type: DataTypes.JSON,
    },
    createdAt: {type: DATE, field: 'created_at'},
    updatedAt: {type: DATE, field: 'updated_at'},
}, {
    sequelize,
    tableName: 'history',
    timestamps: true,
    underscored: true
})

module.exports = model