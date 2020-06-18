const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MasseurSchema = new Schema({
    brand_name: {
      type: String,
      required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mailing_address: String,
    phone_number: String,
    expertise: String,
    date: {
        type: Date,
        default: Date.now
    },
    profile_picture: String,
    location: {
      type: {
        type: String,
        enum: ['Feature'],
        required: true
      },
      geometry: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
      properties: {
        brand_name: String,
        profile_picture: String,
      }
    }
})

module.exports = Masseur = mongoose.model('masseur', MasseurSchema)
