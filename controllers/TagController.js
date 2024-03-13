const TagService = require('../services/TagService')
const {Op} = require("sequelize");

class TagController {
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
                        {icon: {[Op.substring]: JSON.parse(req.query.filter).q}},
                    ]
                }
            }

            const options = {
                where: filters,
            }

            if(req.query.sort) {
                options.order = [JSON.parse(req.query.sort)]
            }

            const tags = await TagService.getAll(options);

            const range = req.headers.range.replace('=', ' ') + '/' + tags.length;

            res.set('Content-Range', range)
            res.set('X-Total-Count', tags.length)

            return res.json(tags);
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const tag = await TagService.getOne(req.params.id);
            return res.json(tag);
        } catch (e) {
            next(e);
        }
    }

    async create(req, res, next) {
        try {
            const tag = await TagService.create(req.body);

            return res.json(tag);
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            await TagService.delete(req.params.id);
            return res.json('ok');
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const tag = await TagService.update(req.params.id, req.body);

            return res.json(tag);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new TagController();