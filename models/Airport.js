const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const Airport = new Schema({
  airport_name: String,
  airport_location: String,
  airport_code: String
}, {  timestamps: true  });
Airport.plugin(AutoIncrement, { inc_field: 'airport_id' });
module.exports = mongoose.model('Airport', Airport);