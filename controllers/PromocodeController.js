const PromocodeService = require('../services/PromocodeService')
const PromocodeDto = require('../dtos/PromocodeDto')
const {Op} = require("sequelize");

class PromocodeController {
    async getAll(req, res, next) {
        try {
            const filters = {}

            if(req.query.filter) {
                if(JSON.parse(req.query.filter).id) {
                    filters.id = JSON.parse(req.query.filter).id
                }

                if(JSON.parse(req.query.filter).q) {
                    filters[Op.or] = [
                        {name: {[Op.substring]: JSON.parse(req.query.filter).q}},
                    ]
                }
            }

            const options = {
                where: filters,
            }

            if(req.query.sort) {
                options.order = [JSON.parse(req.query.sort)]
            }

            const data = await PromocodeService.getAll(options);

            if(req.headers.range) {
                const range = req.headers.range.replace('=', ' ') + '/' + data.length;

                res.set('Content-Range', range)
            }

            res.set('X-Total-Count', data.length)

            return res.json(data.map(i => new PromocodeDto(i)));
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const item = await PromocodeService.getOne(req.params.id);
            return res.json(new PromocodeDto(item));
        } catch (e) {
            next(e);
        }
    }

    async create(req, res, next) {
        try {
            const item = await PromocodeService.create(req.body);

            return res.json(new PromocodeDto(item));
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            await PromocodeService.delete(req.params.id);
            return res.json('ok');
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const item = await PromocodeService.update(req.params.id, req.body);

            return res.json(new PromocodeDto(item));
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new PromocodeController();