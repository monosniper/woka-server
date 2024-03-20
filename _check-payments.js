require('dotenv').config()
const cron = require('node-cron');
const BuyService = require("./services/BuyService");
const RCONService = require("./services/RCONService");
const crypto = require("crypto");

fetch("https://server.woka.fun/api/buys?isCompleted=false", {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
})
    .then(rs => rs.json())
    .then(orders => {
        orders.forEach(({id: orderId}) => {
            const body = {
                shopId: process.env.LAVA_SHOP_ID,
                orderId,
            }
            const signature = crypto.createHmac("sha256", process.env.LAVA_SECRET_KEY)
                .update(JSON.stringify(body))
                .digest("hex");

            body.signature = signature

            fetch("https://api.lava.ru/business/invoice/status", {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    // 'Signature': signature
                },
                body: JSON.stringify(body)
            })
                .then(rs => rs.json())
                .then(rs => console.log(rs))
                .then(async rs => {
                    if(rs.status === 200) {
                        if(rs.data.status === 'success') {
                            console.log("Order ID: " + orderId + " - Status - success")
                            console.log("Run RCON commands")
                            const buy = await BuyService.getOne(orderId)
                            await buy.update({isCompleted: true})
                            await RCONService.process(buy.name, buy.Products)
                        }
                    }
                })
        })
    })

