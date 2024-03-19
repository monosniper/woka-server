const TagService = require('../services/TagService')
const {Op} = require("sequelize");

class PaymentController {
    async callback(req, res, next) {
        try {
            console.log(req.body)

            return res.json('ok');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new PaymentController();