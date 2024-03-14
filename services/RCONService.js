const ProductService = require('../services/ProductService')

class RCONService {
    makeCommand(command, name, count) {
        return command.replaceAll("%name%", name).replaceAll("%amount%", count)
    }

    async process(name, products) {
        products.forEach(async ({id, count, expiry}) => {
            const product = await ProductService.getOne(id)

            // rcon.run(this.makeCommand(product.rcon, name, count))

            if(product.Tag.isPrivilege) {
                const expiries = {
                    1: 'rcon_1',
                    3: 'rcon_3',
                    forever: 'rcon_forever',
                }

                // rcon.run(this.makeCommand(product[expiries[expiry]], name, count))
            }
        })
    }
}

module.exports = new RCONService();