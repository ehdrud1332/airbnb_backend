const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport')
const dotEnv = require('dotenv');
dotEnv.config();
const userRoutes = require('./routes/user');
const roomsRoute = require('./routes/rooms');

// db 커넥션
require('./db');

app.use('/uplaod/', express.static('upload'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD, OPTIONS");
    next();
});
app.use(passport.initialize());
require('./config/password')(passport);


app.use(async function(err, req, res, next) {
    console.error(err.message);
    await res.status(500).json({
        error: err.message
    });
    next();
});
app.use('/user', userRoutes);
app.use('/rooms', roomsRoute);


const port = process.env.PORT


app.listen(port, () => console.log(`server started at ${port}`));
