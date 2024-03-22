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
        const rcon_grief = await Rcon.connect({
            host: process.env.RCON_HOST,
            port: process.env.RCON_GRIEF_PORT,
            password: process.env.RCON_GRIEF_PASSWORD
        })

        const rcon_anarchy = await Rcon.connect({
            host: process.env.RCON_HOST,
            port: process.env.RCON_ANARCHY_PORT,
            password: process.env.RCON_ANARCHY_PASSWORD
        })

        if(!this.black_list.includes(name)) {
            products.forEach(async ({id, count, expiry}) => {
                const product = id === 'money' ? await ProductService.getMoney() : await ProductService.getOne(id)
                const rcon = product.mode === 'GRIEF-M' ? rcon_grief : rcon_anarchy

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
                    console.log(product, expiries[expiry], product[expiries[expiry]])
                    this.getCommands(this.makeCommand(product[expiries[expiry]], name, count)).forEach(async command => {
                        await rcon.send(command)
                    })
                }
            })
        }
    }
}

module.exports = new RCONService();