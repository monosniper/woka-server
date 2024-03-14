const Buy = require("../models/buy");
const RCONService = require('./RCONService')

class BuyService {
    async getAll(options) {
        return Buy.findAll(options);
    }

    async getOne(id) {
        return Buy.findByPk(id);
    }

    async create(data) {
        await RCONService.process(data.name, data.products)

        return Buy.create(data);
    }

    async delete(id) {
        return Buy.destroy({where: {id}});
    }
}

module.exports = new BuyService();