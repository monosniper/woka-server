const Tag = require('./tag')
const Product = require('./product')
const Buy = require('./buy')
const { Model, DataTypes} = require("sequelize");
const {sequelize} = require("../db");

Product.belongsTo(Tag, { as: 'Tag' })

class BuyProduct extends Model {}
const BuyProductThrough = BuyProduct.init({
    count: {
        type: DataTypes.INTEGER,
    }
}, {
    sequelize,
    tableName: 'buy_products'
});

Buy.belongsToMany(Product, { through: BuyProductThrough, as: "BuyProduct" })
Product.belongsToMany(Buy, { through: BuyProductThrough, as: "BuyProduct" })