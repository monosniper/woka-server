require('dotenv').config()
const util = require('minecraft-server-util');

const options = {enableSRV: true};

const hosts = {
    'ANARCHY-M': {
        ip: process.env.RCON_HOST,
        port: process.env.ANARCHY_PORT,
    },
    'GRIEF-M': {
        ip: process.env.RCON_HOST,
        port: process.env.GRIEF_PORT,
    },
}

const data = {}

Object.entries(hosts).forEach(async ([name, {ip, port}]) => {
    const result = await util.queryBasic(ip, +port, options)

    data[name] = result.players.online
})

console.log(data)

fetch("http://localhost:5000/api/history", {
    method: 'post',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        online: data
    })
}).then(rs => {
    console.log("Saved ANARCHY-M: " + data["ANARCHY-M"] + ", GRIEF-M: " + data["GRIEF-M"])
})