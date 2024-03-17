const Buy = require("../models/buy");
const RCONService = require('./RCONService')
const Product = require("../models/product");

class BuyService {
    async getAll(options) {
        return Buy.findAll({...options, include: [{
                association: 'Product',
                // include: ["Buy"]
            }]});
    }

    async getOne(id) {
        return Buy.findByPk(id);
    }

    async create(data, products) {
        await RCONService.process(data.name, products)

        return Buy.create(data);
    }

    async delete(id) {
        return Buy.destroy({where: {id}});
    }
}

module.exports = new BuyService();