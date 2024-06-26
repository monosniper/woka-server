const BuyService = require('../services/BuyService')
const ProductService = require('../services/ProductService')
const {Op} = require("sequelize");
const BuyDto = require("../dtos/BuyDto");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const freekassa = require('@alex-kondakov/freekassa')

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
                        {email: {[Op.substring]: JSON.parse(req.query.filter).q}},
                    ]
                }
            }

            if (req.query.isCompleted) {
                filters.isCompleted = req.query.isCompleted === 'true'
            }

            const options = {
                where: filters,
            }

            if (req.query.sort) {
                options.order = [JSON.parse(req.query.sort)]
            } else {
                options.order = [['created_at', 'desc']]
            }

            if (req.query.limit) {
                options.limit = parseInt(req.query.limit)
            }

            if (req.query.range) {
                options.offset = JSON.parse(req.query.range)[0]
                options.limit = JSON.parse(req.query.range)[1]
            }

            const buys = await BuyService.getAll(options);
            const total_count = await BuyService.getCount();

            if (req.headers.range) {
                const range = req.headers.range.replace('=', ' ') + '/' + buys.length;

                res.set('Content-Range', range)
            }

            res.set('X-Total-Count', total_count)

            return res.json(buys.map(i => new BuyDto(i)));
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

    async pay(req, res, next) {
        try {
            const {name, email, promo, amount, products, variant} = req.body

            const data = {name, email, amount, promo, products}

            const buy = await BuyService.create(data)

            const money_id = await ProductService.getMoney()

            await buy.setProducts(products.map(({id}) => id === 'money' ? money_id : id))

            const result = {}

            if (variant === 'lava') {
                const body = {
                    sum: amount,
                    orderId: buy.id + '_' + uuidv4(),
                    shopId: process.env.LAVA_SHOP_ID,
                    expire: 180,
                    hookUrl: process.env.CALLBACK_URL
                };

                const signature = crypto.createHmac("sha256", process.env.LAVA_SECRET_KEY)
                    .update(JSON.stringify(body))
                    .digest("hex");

                const rq = await fetch("https://api.lava.ru/business/invoice/create", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Signature": signature
                    },
                    body: JSON.stringify(body)
                })
                const rs = await rq.json();

                result.success = rs.status === 200
                result.body = {url: rs.data.url}
            } else if (variant === 'freekassa') {
                try {
                    const ip = req.headers['x-forwarded-for'].split(", ")[0]

                    const FK = freekassa.init()

                    FK.key  = process.env.FREEKASSA_KEY
                    FK.secret1 = process.env.FREEKASSA_SECRET_1
                    FK.secret2 = process.env.FREEKASSA_SECRET_2
                    FK.shopId = process.env.FREEKASSA_SHOP_ID
                    FK.paymentId = buy.id + '_' + uuidv4()
                    FK.amount = amount
                    FK.email = email
                    FK.ip = ip
                    FK.currency = 'RUB'

                    FK.sign();

                    const url = await FK.create()

                    result.body = {url}
                    result.success = true
                } catch (e) {
                    console.error("Error ", e)
                    result.success = false
                }
            } else if (variant === 'aaio') {
                try {
                    const currency = 'RUB'
                    const orderId = buy.id + '_' + uuidv4()

                    const body = {
                        amount,
                        order_id: orderId,
                        merchant_id : process.env.AAIO_SHOP_ID,
                        currency,
                        desc: 'Оплата корзины',
                        email,
                    };

                    const auth_data = [
                        process.env.AAIO_SHOP_ID,
                        amount,
                        currency,
                        process.env.AAIO_SECRET_1,
                        orderId,
                    ].join(":")

                    const signature = crypto.createHash("sha256")
                        .update(auth_data)
                        .digest("hex")

                    body.sign = signature

                    const url = "https://aaio.so/merchant/pay?" + new URLSearchParams(body)

                    // const rq = await fetch("https://aaio.so/merchant/pay", {
                    //     method: "POST",
                    //     headers: {
                    //         "Accept": "application/json",
                    //         "Content-Type": "application/x-www-form-urlencoded",
                    //     },
                    //     body: JSON.stringify(body)
                    // })
                    // const rs = await rq.json();

                    // console.log(rs)

                    result.success = true
                    result.body = {url}
                } catch (e) {
                    console.error("Error ", e)
                    result.success = false
                }
            }

            if(result.success) return res.json(result.body)
            else {
                await BuyService.delete(buy.id)
                return res.json({url: "https://woka.fun?success=false"})
            }
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