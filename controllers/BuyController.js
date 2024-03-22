const BuyService = require('../services/BuyService')
const ProductService = require('../services/ProductService')
const {Op} = require("sequelize");
const BuyDto = require("../dtos/BuyDto");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { createHash } = require('crypto');

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
                filters.isCompleted = req.query.isCompleted
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

                    const body = {
                        amount,
                        currency: "RUB",
                        nonce: uuidv4(),
                        paymentId: buy.id + '_' + uuidv4(),
                        shopId: process.env.FREEKASSA_SHOP_ID,
                        email,
                        ip,
                    };

                    const data = Object.entries(body).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                    const hash = createHash('sha256')

                    hash.write(data.join('|'))
                    hash.update(process.env.FREEKASSA_KEY);

                    const signature = hash.digest('hex');

                    body.signature = signature

                    const rq = await fetch("https://api.freekassa.ru/v1/orders/create", {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body)
                    })
                    const rs = await rq.json();
                    console.log(rs)
                    result.success = rs.status === 200 && rs.data.type === 'success'
                    result.body = {url: rs.data.location}
                } catch (e) {
                    console.error("Cant get IP", req)
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