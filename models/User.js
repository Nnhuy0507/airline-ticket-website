const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const User = new Schema({ 
    email: String,
    last_name: String,
    first_name: String,
    password: String,
    google_id: String,
    phonenumber: String,
    address: String,
    dob: Date,
    picture: String,
    verified: Boolean
}, {  timestamps: true  });
User.plugin(AutoIncrement, { inc_field: 'user_id' });
module.exports = mongoose.model('User', User);