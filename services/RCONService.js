const ProductService = require('../services/ProductService')
const { Rcon } = require('rcon-client')
require('dotenv').config()

class RCONService {
    black_list = [
        'all',
        'alloffline',
        'allonline',
    ]

    makeCommand(command, name, count) {
        return command.replaceAll("{name}", name).replaceAll("{amount}", count)
    }

    getCommands(data) {
        return data.split(";")
    }

    async process(name, products) {
        const rcon = await Rcon.connect({
            host: process.env.RCON_HOST, port: process.env.RCON_PORT, password: process.env.RCON_PASSWORD
        })

        if(!this.black_list.includes(name)) {
            products.forEach(async ({id, count, expiry}) => {
                const product = await ProductService.getOne(id)

                if(product.rcon) {
                    this.getCommands(this.makeCommand(product.rcon, name, count)).forEach(async command => {
                        await rcon.send(command)
                    })
                }

                if(product.Tag.isPrivilege) {
                    const expiries = {
                        '1': 'rcon_1',
                        '3': 'rcon_3',
                        'forever': 'rcon_forever',
                    }

                    this.getCommands(this.makeCommand(product[expiries[expiry]], name, count)).forEach(async command => {
                        await rcon.send(command)
                    })
                }
            })
        }

        await rcon.end()
    }
}

module.exports = new RCONService();