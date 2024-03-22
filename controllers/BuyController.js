const BuyService = require('../services/BuyService')
const ProductService = require('../services/ProductService')
const {Op} = require("sequelize");
const BuyDto = require("../dtos/BuyDto");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

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
            const {name, email, promo, amount, products} = req.body

            const data = {name, email, amount, promo, products}

            const buy = await BuyService.create(data)

            // const _products = []
            // console.log(products)

            const money_id = await ProductService.getMoney()

            // products.forEach(async ({id, count}) => {
            //     if(id === 'money') {
            //         const __product = await ProductService.getMoney()
            //
            //         // __product.Buy.count = count
            //
            //         _products.push(__product)
            //     } else _products.push((await ProductService.getOne(id)))
            // })
            // console.log(_products)
            await buy.setProducts(products.map(({id}) => id === 'money' ? money_id : id))

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
            console.log(rs)
            if(rs.status === 200) {
                return res.json({url: rs.data.url})
            } else return res.json({url: "https://woka.fun?success=false"})
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