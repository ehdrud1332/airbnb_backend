const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    // admin: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'user',
    //     required: true
    // },

    photos : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },

    isFav: {
        type: Boolean,
        default: false
    },

    isSuperHost: {
        type: String,
        required: true
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("rooms", roomSchema)
