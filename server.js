const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
dotEnv.config();


mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("mongoDB conneted"))
    .catch(err => console.log(err.message))


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


const port = process.env.PORT


app.listen(port, () => console.log(`server started at ${port}`));
