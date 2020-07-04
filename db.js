
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindIndex: true,
})
    .then(() => console.log("mongoDB connected"))
    .catch(err => console.log(err.message))
