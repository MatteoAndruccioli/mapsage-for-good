const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MunicipalitySchema = new Schema({
    type: {
      type: String,
      enum: ['Feature']
    },
    properties: {
      name: String,
      minint_elettorale: String,
      op_id: String,
      prov_name: String,
      prov_istat_code: String,
      prov_istat_code_num: Number,
      prov_acr: String,
      reg_name: String,
      reg_istat_code: String,
      reg_istat_code_num: Number,
      opdm_id: String,
      com_catasto_code: String,
      com_istat_code: String,
      com_istat_code_num: Number
    },
    geometry : {
      type: {
        type: String,
        enum: ['MultiPolygon']
      },
      coordinates: [[[[Number]]]]
    }
})

module.exports = Municipality = mongoose.model('municipality', MunicipalitySchema, 'municipalities')
