const BuyService = require('../services/BuyService')
const RCONService = require('../services/RCONService')
const crypto = require("crypto");

class PaymentController {
    async callback(req, res, next) {
        const {status, order_id} = req.body
        const authorization = req.headers.Authorization
        const signature = crypto.createHmac("sha256", process.env.LAVA_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest("hex")

        try {
            if(authorization === signature) {
                if(status === 'success') {
                    const buy = await BuyService.getOne(order_id)
                    await RCONService.process(buy.name, buy.Products)
                }

                return res.json('ok');
            }
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new PaymentController();