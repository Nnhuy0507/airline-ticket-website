const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ticket = new Schema({
    airline_id: {type: Schema.Types.ObjectId, ref: 'Airline' }, 
    flight_id: {type: Schema.Types.ObjectId, ref: 'Flight' },
    user_id: {type: Schema.Types.ObjectId, ref: 'User' },
    seat: String,
    passenger_info: {type: Map, of: String},
    refund: {type: Boolean, default: false},
    status: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid"
},

    ticket_class: String
}, {  timestamps: true  });

module.exports = mongoose.model('Ticket', Ticket);