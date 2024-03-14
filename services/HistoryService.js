const History = require("../models/history");

class HistoryService {
    async getAll(options) {
        return History.findAll(options);
    }

    async create(data) {
        return History.create(data);
    }
}

module.exports = new HistoryService();