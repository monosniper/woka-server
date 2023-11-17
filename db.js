const Sequelize = require('sequelize')

// const sequelize = new Sequelize(
//     'wokasitedonate',
//     'wokamcdonate',
//     'hV4pSyU0cTjF6sX8lK7f9mS0s5xG4a',
//     {
//         host: '193.164.17.17',
//         dialect: 'mysql',
//     },
// );

const sequelize = new Sequelize(
    'fc404394_woka',
    'fc404394_woka',
    '9fk&7F@6Nz',
    {
        host: 'fc404394.mysql.tools',
        dialect: 'mysql',
    },
);

module.exports = sequelize