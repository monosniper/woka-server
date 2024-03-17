require('dotenv').config()
const util = require('minecraft-server-util');

const options = {enableSRV: true};

util.queryBasic(process.env.RCON_HOST, +process.env.QUERY_PORT, options)
    .then((result) => {
        fetch("http://localhost:5000/api/history", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                online: result.players.online
            })
        }).then(rs => {
            console.log("Saved ANARCHY-M: " + data["ANARCHY-M"] + ", GRIEF-M: " + data["GRIEF-M"])
        })
    })
    .catch((error) => console.error(error));

// const hosts = {
//     'ANARCHY-M': {
//         ip: process.env.RCON_HOST,
//         port: process.env.ANARCHY_PORT,
//     },
//     'GRIEF-M': {
//         ip: process.env.RCON_HOST,
//         port: process.env.GRIEF_PORT,
//     },
// }
//
// const data = {}
//
// Object.entries(hosts).forEach(([name, {ip, port}]) => {
//     util.queryBasic(ip, +port, options)
//         .then((result) => {
//             fetch("http://localhost:5000/api/history", {
//                 method: 'post',
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     online: {name, count: result.players.online}
//                 })
//             }).then(rs => {
//                 console.log("Saved ANARCHY-M: " + data["ANARCHY-M"] + ", GRIEF-M: " + data["GRIEF-M"])
//             })
//         })
//         .catch((error) => console.error(error));
// })