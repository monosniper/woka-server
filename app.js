const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const indexRouter = require('./routes/index');
const app = express();
const db = require("./db");
require("./models");
require('dotenv').config()

const corsOptions = {
    origin: [
        process.env.ADMIN_ORIGIN,
        process.env.SITE_ORIGIN,
    ],
    exposedHeaders: ['Content-Range']
};

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
app.use(cookieParser());
app.use(express.static('uploads'));

app.use('/api', indexRouter);

db.sync({ force: false })
    .then(() => {
        app.listen(process.env.API_PORT, () => {
            console.log(`Server is running on port ${process.env.API_PORT}.`);
        });
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

module.exports = app;