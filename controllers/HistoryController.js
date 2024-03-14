const HistoryService = require('../services/HistoryService')

class HistoryController {
    async getAll(req, res, next) {
        try {
            const data = await HistoryService.getAll();

            return res.json(data);
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