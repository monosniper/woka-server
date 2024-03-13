const Promocode = require('../models/promocode')
const {Op} = require("sequelize");

class PromocodeService {
    async getAll(options) {
        return Promocode.findAll(options);
    }

    async getOne(id) {
        return Promocode.findByPk(id);
    }

    async create(data) {
        return await Promocode.create(data, {
            fields: [
                'name',
                'amount',
                'count',
            ]
        });
    }

    async delete(id) {
        return Promocode.destroy({where: {id}});
    }

    async check(name) {
        return await Promocode.findOne({where: {name, count: {[Op.gt]: 0}}});
    }

    async update(id, data) {
        await Promocode.update(data, {
            where: {id}, fields: [
                'name',
                'amount',
                'count',
            ]
        });

        return await Promocode.findByPk(id);
    }
}

module.exports = new PromocodeService();