const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController')
const PromocodeController = require('../controllers/PromocodeController')
const TagController = require('../controllers/TagController')
const BuyController = require('../controllers/BuyController')
const PunishmentController = require('../controllers/PunishmentController')
const HistoryController = require('../controllers/HistoryController')
const util = require('minecraft-server-util')
const {Rcon} = require("rcon-client");

router.get('/products', ProductController.getAll);
router.get('/products/:id', ProductController.getOne);
router.post('/products', ProductController.create);
router.delete('/products/:id', ProductController.delete);
router.put('/products/:id', ProductController.update);

router.get('/promocodes', PromocodeController.getAll);
router.get('/promocodes/:id', PromocodeController.getOne);
router.post('/promocodes', PromocodeController.create);
router.delete('/promocodes/:id', PromocodeController.delete);
router.put('/promocodes/:id', PromocodeController.update);
router.post('/check-promo', PromocodeController.check);

router.get('/tags', TagController.getAll);
router.get('/tags/:id', TagController.getOne);
router.post('/tags', TagController.create);
router.delete('/tags/:id', TagController.delete);
router.put('/tags/:id', TagController.update);

router.get('/buys', BuyController.getAll);
router.get('/buys/:id', BuyController.getOne);
router.post('/pay', BuyController.pay);
router.delete('/buys/:id', BuyController.delete)

router.get('/punishments', PunishmentController.getAll);

router.get('/history', HistoryController.getAll);
router.post('/history', HistoryController.create)

router.get('/test', async (req,res,next) => {
    const rcon = await Rcon.connect({
        host: '202.181.188.208', port: 22744, password: 'sDc1Drl02ZDXNseTE76WJIE4wbAmv5sD'
    })

    await rcon.send('lp user SmileClock parent clear')
    await rcon.send('lp user SmileClock parent clear')
    await rcon.send('points give SmileClock 30')

    await rcon.end()
});

router.get('/test', (req, res, next) => {
    const options = {
        sessionID: 1, // a random 32-bit signed number, optional
        enableSRV: true // SRV record lookup
    };

    // The port and options arguments are optional, the
    // port will default to 25565 and the options will
    // use the default options.
    util.queryBasic('193.164.16.188', 25565, options)
        .then((result) => console.log(result))
        .catch((error) => console.error(error));

    return res.json('hui');
});

router.get('/rcon', (req, res, next) => {
    const client = new util.RCON();

    const connectOpts = {
        timeout: 1000 * 5
        // ... any other connection options specified by
        // NetConnectOpts in the built-in `net` Node.js module
    };

    const loginOpts = {
        timeout: 1000 * 5
    };

    (async () => {
        await client.connect('95.216.62.179', 25693, connectOpts);
        await client.login('K6OLCBIym58eWwCiXCG3B0MYLmHKmqwX', loginOpts);

        const message = await client.execute('op Sm1leClock');
        console.log(message);

        await client.close();
    })();

    return res.json('hui');
});

module.exports = router;