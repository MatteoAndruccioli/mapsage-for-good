const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CustomerSchema = new Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    profile_picture: {
        type: String
    }
})

module.exports = Customer = mongoose.model('customer', CustomerSchema)
