const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const Airline = new Schema({
  airline_name: String,
  airline_logo: String
}, {  timestamps: true  });
Airline.plugin(AutoIncrement, { inc_field: 'airline_id' });
module.exports = mongoose.model('Airline', Airline);
