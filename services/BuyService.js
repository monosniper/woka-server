const Buy = require("../models/buy");
const RCONService = require('./RCONService')
const Product = require("../models/product");

class BuyService {
    async getAll(options) {
        return Buy.findAll({...options, include: [Product]});
    }

    async getOne(id) {
        return Buy.findByPk(id);
    }

    async create(data) {
        return Buy.create(data);
    }

    async delete(id) {
        return Buy.destroy({where: {id}});
    }

    async getCount() {
        return Buy.count();
    }
}

module.exports = new BuyService();