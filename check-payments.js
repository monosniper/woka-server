require('dotenv').config()
const cron = require('node-cron');
const BuyService = require("./services/BuyService");
const RCONService = require("./services/RCONService");

cron.schedule('*/5 * * * *', function() {
    fetch("http://localhost:5000/api/buys?completed=false")
        .then(rs => rs.json())
        .then(orders => {
            orders.forEach(({id: orderId}) => {
                fetch("https://api.lava.ru/business/invoice/status", {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        shopId: process.env.LAVA_SHOP_ID,
                        orderId,
                    })
                })
                    .then(rs => rs.json())
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
});