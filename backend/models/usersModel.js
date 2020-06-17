const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
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
    profile_type: {
      type: String,
      enum: ['Customer', 'Masseur'],
      required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    profile_picture: String,
    location: {
      type: {
        type: String,
        enum: ['Feature'],
      },
      geometry: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: {
          type: [Number],
        }
      },
      properties: {
        full_name: String,
      }
    }
    // Da aggiungere i restanti campi all'occorrenza
})

module.exports = User = mongoose.model('user', UserSchema)
