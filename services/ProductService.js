const Product = require('../models/product')
const Tag = require("../models/tag");

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

class ProductService {
    async getAll(options) {
        return shuffleArray(Product.findAll(options));
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