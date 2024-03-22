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
            console.log("WEBHOOOOOOOOK ")
            console.log("authorization === signature " + authorization === signature)
            console.log(req.body)
            if(authorization === signature) {
                if(status === 'success') {
                    const buy = await BuyService.getOne(order_id.split("_")[0])
                    buy.isCompleted = true
                    await buy.save()
                    const products = await buy.products
                    await RCONService.process(buy.name, products)
                }
                console.log('ok')
                return res.json('ok');
            }
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new PaymentController();