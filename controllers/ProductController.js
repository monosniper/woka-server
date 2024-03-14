const ProductService = require('../services/ProductService')
const UploadService = require('../services/UploadService')
const ProductDto = require('../dtos/ProductDto')
const {Op, literal} = require("sequelize");

class ProductController {
    async getAll(req, res, next) {
        try {
            const filters = {}

            if(req.query.filter) {
                if(JSON.parse(req.query.filter).id) {
                    filters.id = JSON.parse(req.query.filter).id
                }

                if(JSON.parse(req.query.filter).q) {
                    filters[Op.or] = [
                        {title: {[Op.substring]: JSON.parse(req.query.filter).q}},
                        {description: {[Op.substring]: JSON.parse(req.query.filter).q}},
                    ]
                }
            }

            const options = {
                where: filters,
            }

            if(req.query.sort) {
                options.order = [JSON.parse(req.query.sort)]
            }
            // else {
            //     options.order = literal('max(priority) DESC')
            // }

            const products = await ProductService.getAll(options);

            if(req.headers.range) {
                const range = req.headers.range.replace('=', ' ') + '/' + products.length;

                res.set('Content-Range', range)
            }

            res.set('X-Total-Count', products.length)

            return res.json(products.map(p => new ProductDto(p)));
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const product = await ProductService.getOne(req.params.id);
            return res.json(product);
            // return res.json(new ProductDto(product));
        } catch (e) {
            next(e);
        }
    }

    async create(req, res, next) {
        try {
            const product = await ProductService.create(req.body);

            if(req.body.image) {
                const fileName = await UploadService.save(req.body.image, 'products', product.id, product.image)
                product.image = '/products/'+fileName;
                await product.save()
            }

            return res.json(new ProductDto(product));
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            await ProductService.delete(req.params.id);
            return res.json('ok');
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const product = await ProductService.update(req.params.id, req.body);

            if(req.body.image) {
                const fileName = await UploadService.save(req.body.image, 'products', product.id)
                product.image = '/products/'+fileName;
                await product.save()
            }

            return res.json(new ProductDto(product));
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ProductController();