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
    //short description of masseur's past experience and skill used for introduction
    expertise: String,
    //list of advertisement published by this user
    advertisements: [{
      title: String,
      body: String
    }],
    //masseur's followers
    followers: [{
      follower_id: String,
      follower_type: String
    }],
    //notifications about advertisement published by masseurs' followed by this user
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
    //info to geolocalize masseur's study
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
