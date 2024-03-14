const ProductService = require('../services/ProductService')

class RCONService {
    makeCommand(command, name, count) {
        return command.replaceAll("%name%", name).replaceAll("%amount%", count)
    }

    getCommands(data) {
        return data.split(";")
    }

    async process(name, products) {
        products.forEach(async ({id, count, expiry}) => {
            const product = await ProductService.getOne(id)

            this.getCommands(this.makeCommand(product.rcon, name, count)).forEach(command => {
                // rcon.run(command)
            })

            if(product.Tag.isPrivilege) {
                const expiries = {
                    1: 'rcon_1',
                    3: 'rcon_3',
                    forever: 'rcon_forever',
                }

                this.getCommands(this.makeCommand(product[expiries[expiry]], name, count)).forEach(command => {
                    // rcon.run(command)
                })
            }
        })
    }
}

module.exports = new RCONService();