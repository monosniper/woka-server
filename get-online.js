const util = require('minecraft-server-util');

const options = {enableSRV: true};

util.queryBasic('202.181.188.208', 25565, options)
    .then((result) => {
        fetch("http://localhost:5000/api/history", {
            method: 'post',
            body: JSON.stringify({
                online: result.players.online
            })
        }).then(rs => {
            console.log('Online: ' + result.players.online + " saved")
        })
    })
    .catch((error) => console.error(error));