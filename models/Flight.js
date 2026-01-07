const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const Flight = new Schema({
    airline_id: {type: Schema.Types.ObjectId, ref: 'Airline' }, 
    departure_airport_id: {type: Schema.Types.ObjectId, ref: 'Airport' },
    arrival_airport_id: {type: Schema.Types.ObjectId, ref: 'Airport' },
    departure_datetime: Date,
    arrival_datetime: Date,
    economy_price: Number,
    business_price: Number
}, {  timestamps: true  });
Flight.plugin(AutoIncrement, { inc_field: 'flight_id' });
module.exports = mongoose.model('Flight', Flight);