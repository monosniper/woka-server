const BuyService = require('../services/BuyService')
const {Op} = require("sequelize");

class BuyController {
    async getAll(req, res, next) {
        try {
            const filters = {}

            if (req.query.filter) {
                if (JSON.parse(req.query.filter).id) {
                    filters.id = JSON.parse(req.query.filter).id
                }

                if (JSON.parse(req.query.filter).q) {
                    filters[Op.or] = [
                        {name: {[Op.substring]: JSON.parse(req.query.filter).q}},
                        {icon: {[Op.substring]: JSON.parse(req.query.filter).q}},
                    ]
                }
            }

            const options = {
                where: filters,
            }

            if (req.query.sort) {
                options.order = [JSON.parse(req.query.sort)]
            }

            if (req.query.limit) {
                options.limit = parseInt(req.query.limit)
            }

            const buys = await BuyService.getAll(options);

            if (req.headers.range) {
                const range = req.headers.range.replace('=', ' ') + '/' + buys.length;

                res.set('Content-Range', range)
            }

            res.set('X-Total-Count', buys.length)

            return res.json(buys);
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const tag = await BuyService.getOne(req.params.id);
            return res.json(tag);
        } catch (e) {
            next(e);
        }
    }

    async create(req, res, next) {
        try {
            const tag = await BuyService.create(req.body);

            return res.json(tag);
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            await BuyService.delete(req.params.id);
            return res.json('ok');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new BuyController();