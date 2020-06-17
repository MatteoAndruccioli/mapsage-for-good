const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MasseurSchema = new Schema({
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
        full_name: String,
      }
    }
    // Da aggiungere i restanti campi all'occorrenza
})

module.exports = Masseur = mongoose.model('masseur', MasseurSchema)
