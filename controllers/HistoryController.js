const HistoryService = require('../services/HistoryService')

class HistoryController {
    async getAll(req, res, next) {
        try {
            const options = {
                order: [['created_at', 'desc']]
                // where: filters,
            }

            if (req.query.limit) {
                options.limit = parseInt(req.query.limit)
            }

            const data = await HistoryService.getAll(options);

            return res.json(data.reverse());
        } catch (e) {
            next(e);
        }
    }

    async create(req, res, next) {
        try {
            const data = await HistoryService.create(req.body);

            return res.json(data);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new HistoryController();