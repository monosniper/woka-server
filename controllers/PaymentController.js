const BuyService = require('../services/BuyService')
const RCONService = require('../services/RCONService')
const crypto = require("crypto");
const md5 = require('md5');

class PaymentController {
    async callback(req, res, next) {
        const { variant } = req.params

        console.log("WEBHOOOOOOOOK ")
        console.log(req.body)

        if(variant === 'lava') {
            const {status, order_id} = req.body
            const authorization = req.headers.Authorization
            const signature = crypto.createHmac("sha256", process.env.LAVA_SECRET_KEY)
                .update(JSON.stringify(req.body))
                .digest("hex")
            console.log(authorization, signature, authorization === signature, req.headers)
            try {
                if(status === 'success') {
                    const buy = await BuyService.getOne(order_id.split("_")[0])
                    buy.isCompleted = true
                    await buy.save()
                    const products = await buy.products
                    await RCONService.process(buy.name, products)
                }
                console.log('ok')
                return res.json('ok');

                // if(authorization === signature) {
                //     if(status === 'success') {
                //         const buy = await BuyService.getOne(order_id.split("_")[0])
                //         buy.isCompleted = true
                //         await buy.save()
                //         const products = await buy.products
                //         await RCONService.process(buy.name, products)
                //     }
                //     console.log('ok')
                //     return res.json('ok');
                // }
            } catch (e) {
                next(e);
            }
        } else if(variant === 'freekassa') {
            const whitelist = [
                '168.119.157.136',
                '168.119.60.227',
                '178.154.197.79',
                '51.250.54.238',
            ]

            if(!whitelist.includes(req.headers['x-forwarded-for'].split(', ')[0]))
                return res.json('poshel naxui');

            const { AMOUNT, MERCHANT_ORDER_ID, SIGN } = req.body

            const auth_data = [
                process.env.FREEKASSA_SHOP_ID,
                AMOUNT,
                process.env.FREEKASSA_SECRET_2,
                MERCHANT_ORDER_ID,
            ].join(":")

            const authorization = md5(auth_data)

            if(authorization === SIGN) {
                const buy = await BuyService.getOne(MERCHANT_ORDER_ID.split("_")[0])
                buy.isCompleted = true
                await buy.save()
                const products = await buy.products
                await RCONService.process(buy.name, products)
                return res.json('YES');
            } else {
                console.log(authorization, SIGN)
                console.log(req.body)
                return res.json('NO');
            }
        } else if (variant === 'aaio') {
            const whitelist = [
                '91.107.204.74',
            ]

            if(!whitelist.includes(req.headers['x-forwarded-for'].split(', ')[0]))
                return res.json('poshel naxui');

            const { order_id, amount, currency, sign } = req.body
            const buy_id = order_id.split("_")[0]

            const auth_data = [
                process.env.AAIO_SHOP_ID,
                amount,
                currency,
                process.env.AAIO_SECRET_2,
                order_id,
            ].join(":")

            const authorization = crypto.createHash("sha256")
                .update(auth_data)
                .digest("hex")
            console.log(authorization)
            if(authorization === sign) {
                const buy = await BuyService.getOne(buy_id)
                buy.isCompleted = true
                await buy.save()
                const products = await buy.products
                await RCONService.process(buy.name, products)
                return res.json('YES');
            }
        }

        return res.json('NO');
    }
}

module.exports = new PaymentController();