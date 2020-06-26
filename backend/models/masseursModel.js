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
    phone_number: String,
    expertise: String,
    advertisements: [{
      title: String,
      body: String
    }],
    followers: [{
      follower_id: String,
      follower_type: String
    }],
    notifications: [{
      masseur_id: String,
      masseur_brand: String,
      advertisement_title: String,
      visualized: Boolean
    }],
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
