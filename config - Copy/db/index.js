const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1/banvemaybay')
        .then(() => console.log("Connected to MongoDB successfully"));
      
    } catch (error) {
        console.log(error);
    }
}
module.exports = { connect };  