const Product = require('../models/product')
const Tag = require("../models/tag");

class ProductService {
    async getAll(options) {
	return Product.findAll(options);
    }

    async getOne(id) {
	return Product.findByPk(id);
    }

    async create(data) {
	return await Product.create(data, {
	    fields: [
		'title',
		'description',
		'price',
		'expiry',
		'TagId',
	    ]
	});
    }

    async delete(id) {
	return Product.destroy({ where: { id } });
    }

    async update(id, data) {
	await Product.update(data, { where: { id }, fields: [
	    'title',
	    'description',
	    'price',
	    'expiry',
	    'TagId',
	]});

	return await Product.findByPk(id);
    }
}

module.exports = new ProductService();