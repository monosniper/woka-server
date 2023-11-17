const Tag = require('./tag')
const Product = require('./product')
const Promocode = require('./promocode')
const Buy = require('./buy')
const { Model } = require("sequelize");
const sequelize = require("../db");

Product.belongsTo(Tag, { as: 'Tag' })
Buy.belongsTo(Product, { as: 'Product' })

class ProductPromocode extends Model {}
const ProductPromocodeThrough = ProductPromocode.init({}, {
    sequelize,
    tableName: 'product_promocodes'
});

Promocode.belongsToMany(Product, { through: ProductPromocodeThrough })
Product.belongsToMany(Promocode, { through: ProductPromocodeThrough })