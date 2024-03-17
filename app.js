const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const indexRouter = require('./routes/index');
const app = express();
const {sequelize, connection} = require("./db");
require("./models");
require('dotenv').config()

// const corsOptions = {
//     origin: [
//         process.env.ADMIN_ORIGIN,
//         process.env.SITE_ORIGIN,
//     ],
//     exposedHeaders: ['Content-Range', 'X-Total-Count']
// };

// app.use(cors(corsOptions));
// app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Expose-Headers", "X-Total-Count,Content-Range");
    next();
});
app.use(logger('dev'));
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
app.use(cookieParser());
app.use(express.static('uploads'));

app.use('/api', indexRouter);

// sequelize.sync({ force: true })
sequelize.sync({ force: false })
    .then(() => {
        connection.connect(() => {
            app.listen(process.env.API_PORT, () => {
                console.log(`Server is running on port ${process.env.API_PORT}.`);
            });
        })
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

module.exports = app;