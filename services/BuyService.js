const Buy = require("../models/buy");

class BuyService {
    async getAll(options) {
        return Buy.findAll(options);
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
}

module.exports = new BuyService();