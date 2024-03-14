const Product = require('../models/product')
const Tag = require("../models/tag");

class ProductService {
    async getAll(options) {
        return Product.findAll(options);
    }

    async getOne(id) {
        return Product.findByPk(id, {include: [Tag]});
    }

    async create(data) {
        return await Product.create(data, {
            fields: [
                'title',
                'description',
                'price',
                'price_1',
                'price_3',
				'bonus',
				'bonus_1',
				'bonus_3',
				'discount',
                'expiry',
                'TagId',
                'rcon_1',
                'rcon_3',
                'rcon_forever',
                'rcon',
            ]
        });
    }

    async delete(id) {
        return Product.destroy({where: {id}});
    }

    async update(id, data) {
        await Product.update(data, {
            where: {id}, fields: [
                'title',
                'description',
                'price',
                'price_1',
                'price_3',
                'bonus',
                'bonus_1',
                'bonus_3',
                'discount',
                'expiry',
                'TagId',
                'rcon_1',
                'rcon_3',
                'rcon_forever',
                'rcon',
            ]
        });

        return await Product.findByPk(id);
    }
}

module.exports = new ProductService();