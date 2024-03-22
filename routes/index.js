const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController')
const PromocodeController = require('../controllers/PromocodeController')
const TagController = require('../controllers/TagController')
const BuyController = require('../controllers/BuyController')
const PunishmentController = require('../controllers/PunishmentController')
const HistoryController = require('../controllers/HistoryController')
const PaymentController = require('../controllers/PaymentController')

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

router.post('/callback', PaymentController.callback)

module.exports = router;