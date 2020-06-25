const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CustomerSchema = new Schema({
    first_name: String,
    last_name: String,
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
    },
    followed: [String],
    notifications: [{
      masseur_id: String,
      masseur_brand: String,
      advertisement_title: String,
      visualized: Boolean
    }]
})

module.exports = Customer = mongoose.model('customer', CustomerSchema)
