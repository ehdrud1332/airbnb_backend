const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
dotEnv.config();
const userRoutes = require('./routes/user');


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("mongoDB conneted"))
    .catch(err => console.log(err.message))


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD, OPTIONS");
    next();
});

app.use(async function(err, req, res, next) {
    console.error(err.message);
    await res.status(500).json({
        error: err.message
    });
    next();
});
app.use('/user', userRoutes);

const port = process.env.PORT


app.listen(port, () => console.log(`server started at ${port}`));
